function getAddr(name, memory) {
    // deal with pointers
    if(name.match(/^\[.+\]$/)) {
        return memory[getAddr(name.substring(1, name.length - 1), memory)];
    }

    return parseInt(name);
}

function rawOut(value) {
    const output = document.getElementById('outputTextArea');
    output.value += String.fromCharCode(value);
    output.scrollTop = output.scrollHeight;
}

let instructions = {
    'set': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)] = parseInt(args[1]);
        },
        args: 2
    },
    'inc': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)]++;
        },
        args: 1
    },
    'dec': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)]--;
        },
        args: 1
    },
    'out': {
        execute: (args, state) => {
            rawOut(state.memory[getAddr(args[0], state.memory)]);
        },
        args: 1
    },
    'mov': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)] = state.memory[getAddr(args[1], state.memory)];
        },
        args: 2
    },
    'add': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)] += state.memory[getAddr(args[1], state.memory)];
        },
        args: 2
    },
    'sub': {
        execute: (args, state) => {
            state.memory[getAddr(args[0], state.memory)] -= state.memory[getAddr(args[1], state.memory)];
        },
        args: 2
    },
    'loop': {
        execute: (args, state) => {
            state.loopMarkers.push(state.ip);
        },
        args: 0
    },
    'until': {
        execute: (args, state) => {
            const newIp = state.loopMarkers.pop();
            console.log(state.memory[getAddr(args[0], state.memory)]);
            if(state.memory[getAddr(args[0], state.memory)] !== 0) {
                state.ip = newIp - 1;
            }
        },
        args: 1
    },
    aliases: {
        's': 'set',
        'o': 'out',
        'm': 'mov',
        'a': 'add',
        'u': 'sub',
        'l': 'loop',
        'i': 'inc',
        'd': 'dec'
    }
};

function executeInstruction(line, state) {
    const instruction = line.split(/ (.+)/);

    const name = instruction[0];
    let args;
    if(instruction.length > 1)
        args = instruction[1].split(',');

    if(args != undefined) {
        for(j = 0; j < args.length; j++)
            args[j] = args[j].trim();
    }

    const debug = document.getElementById('debugTextArea');

    debug.innerHTML = '';

    debug.innerHTML += 'Instruction: ' + name + '\n';
    if(args != undefined)
        debug.innerHTML += 'Arguments: ' + args.join(', ') + '\n';

    // Find the instruction, either from its full name, or an alias
    const operation = 
        instructions[name] === undefined ?
        instructions[instructions.aliases[name]] : 
        instructions[name];

    if(operation !== undefined) {
        const numArgs = args === undefined ? 0 : args.length;
        if(numArgs !== operation.args) {
            debug.innerHTML = 'Wrong number of arguments for ' + name + ' got ' + numArgs + ' expected ' + operation.args;
        } else {
            operation.execute(args, state);
        }
    } else {
        debug.innerHTML = 'Undefined instruction: ' + name;
        return false;
    }

    state.ip++;
    return true;
}

function runProgram(target, display) {
    console.clear();

    let state = {
        memory: new Array(512),
        ip: 0,
        loopMarkers: []
    };

    const outText = document.getElementById(display);
    outText.value = ''; // clear for prev runs

    const program = document.getElementById(target).value;
    let lines = program.split(/[\n|;]/);

    for(i = 0; i < state.memory.length; i++)
        state.memory[i] = 0; // fill memory

    timeout = setInterval(function(){
        const output = executeInstruction((lines[state.ip] == undefined ? '': lines[state.ip]), state);

        if(!output || lines[state.ip] == undefined) {
            console.log('Should stop!');
            clearInterval(timeout);
        }
    }, parseInt(document.getElementById('executionDelayMs').value));

    console.log('done');
}