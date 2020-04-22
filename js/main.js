let memory;
let ip = 0;

function dumpMem() {
    for(i = 0; i < memory.length - 17; i += 16) {
        let bytestring = '0x' + i.toString(16).padStart(3, '0') + ': ';
        for(j = i; j < i + 16;j++) {
            bytestring += memory[i + j].toString(16).padStart(2, '0') + ' ';    
        }
        console.log(bytestring);
    }
}

function getAddr(name) {
    // deal with pointers
    if(name.match(/^\[.+\]$/)) {
        return memory[getAddr(name.substring(1, name.length - 1))];
    }

    let addr = parseInt(name);

    if(isNaN(addr))
        addr = names[name];

    return addr;
}

function rawOut(value) {
    const output = document.getElementById('outputTextArea');
    output.value += String.fromCharCode(value);
    output.scrollTop = output.scrollHeight;
}

let instructions = {
    'set': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])] = parseInt(args[1]);
        }
    },
    'inc': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])]++;
        }
    },
    'dec': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])]++;
        }
    },
    'out': {
        execute: (args, memory, ip) => {
            rawOut(memory[getAddr(args[0])]);
        }
    },
    'mov': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])] = memory[getAddr(args[1])];
        }
    },
    'add': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])] += memory[getAddr(args[1])];
        }
    },
    'sub': {
        execute: (args, memory, ip) => {
            memory[getAddr(args[0])] -= memory[getAddr(args[1])];
        }
    },
    'loop': {
        execute: (args, memory, ip) => {
            if(memory[getAddr(args[0])] == 0) {
                ip = getLabelAddr(args[1]);
            }
        }
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

function executeInstruction(line, output) {
    // Ignore line
    if(line.match(/^[A-z]+\:\s*$/)) {
        ip++;
        return true;
    }

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

    const operation = 
        instructions[name] === undefined ?
        instructions[instructions.aliases[name]] : 
        instructions[name];

    if(operation !== undefined) {
        operation.execute(args, memory, ip);
    } else {
        debug.innerHTML = 'Undefined instruction: ' + name;
        return false;
    }

    ip++;
    return true;
}

// function minify(target)
// {
//     const elem = document.getElementById(target);
//     const program = elem.value;
//     let outProgram = '';

//     const convert = {'j':'~', 'set':'=', 'out':'<', 'outasc':'<*', 'move':'->', 'add':'+',
//         'addi':'+.', 'sub':'-', 'subi':'-.', 'bz':'/0', 'bnz':'/!0', 'bgt':'/>', 'bgteq':'/>=',
//         'blt':'/<', 'blteq':'/<=', 'halt':'h'};

//     let names = {};

//     program.split('\n').forEach(line => {
//         const instruction = line.split(/ (.+)/)[0].trim();
//         const args = line.split(/ (.+)/)[1];

//         console.log(convert[instruction]);

//         if(convert[instruction] != undefined)
//             instruction = convert[instruction];

//         if(args == undefined)
//             args = '';

//         if(instruction != '')
//             outProgram += instruction + ' ' + args + ';';
//     });

//     elem.value = outProgram;
// }

function runProgram(target, display) {
    console.clear();

    const outText = document.getElementById(display);
    outText.value = ''; // clear for prev runs

    const program = document.getElementById(target).value;
    let lines = program.split(/[\n|;]/);

    memory = new Array(512);
    for(i = 0; i < memory.length; i++)
        memory[i] = 0; // fill memory

    ip = 0;

    // // build names
    // lines.forEach(line => {
    //     if(line.match(/\.name \d+ \w+$/)) {            
    //         names[line.split(' ')[2]] = parseInt(line.split(' ')[1]);
    //         lines = lines.filter(item => item != line);
    //     } else if(line.match(/^#/) || line.match(/^\s*$/)) {
    //         lines = lines.filter(item => item != line);
    //     } else if(line.match(/\.s \d+ \'.*\'/)) {
    //         const str = line.replace(/.s \d+ /, '').replace(/\'/g, '');
    //         const addr = parseInt(line.split(' ')[1]);
    //         let i = 0;
    //         for( ; i < str.length; i++) {
    //             memory[i+addr] = str.charCodeAt(i);
    //         }
            
    //         memory[i+addr+1] = 0;

    //         // console.log('String: ' + str + ' @ ' + addr);
    //         lines = lines.filter(item => item != line);
    //     } else if(line.match(/^[A-z]+\:\s*$/)) {
    //         labels[line.split(':')[0]] = lines.indexOf(line);
    //     }
    // });

    timeout = setInterval(function(){
        const output = executeInstruction((lines[ip] == undefined ? '': lines[ip]), outText);

        if(!output || lines[ip] == undefined) {
            console.log('Should stop!');
            clearInterval(timeout);
        }
    }, parseInt(document.getElementById('executionDelayMs').value));

    console.log('done');
}