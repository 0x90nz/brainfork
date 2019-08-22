var labels = {};
var names = {};
var memory = new Array(1024);
var ip = 0;

function dumpMem()
{
    for(i = 0; i < memory.length - 17; i += 16)
    {
        var bytestring = "0x" + i.toString(16).padStart(3, "0") + ": ";
        for(j = i; j < i + 16;j++)
        {
            bytestring += memory[i + j].toString(16).padStart(2, "0") + " ";    
        }
        console.log(bytestring);
    }
}

function getAddr(name)
{
    // deal with pointers
    if(name.match(/^\[.+\]$/))
    {
        return memory[getAddr(name.substring(1, name.length - 1))];
    }

    var addr = parseInt(name);

    if(isNaN(addr))
        addr = names[name];

    console.log("returning " + addr + " for " + name);
    return addr;
}

function getLabelAddr(name)
{
    var addr = parseInt(name);
    if(isNaN(addr))
        addr = labels[name] + 1;

    return addr;
}

function executeInstruction(line, output)
{
    var instruction = line.split(/ (.+)/);
    var name = instruction[0];
    var args;
    if(instruction.length > 1)
        args = instruction[1].split(",");

    if(args != undefined)
    {
        for(j = 0; j < args.length; j++)
            args[j] = args[j].trim();
    }

    var debug = document.getElementById('debugTextArea');

    debug.value = "";

    debug.value += "Instruction: " + name + "\n";
    if(args != undefined)
        debug.value += "Arguments: " + args.join(', ') + "\n";

    switch (name) {
        case "j":
            ip = getLabelAddr(args[0]);
            console.log("jumping to " + args[0] + " (" + ip + ")");
            return true;
        
        case "set":
        case "=":
            memory[getAddr(args[0])] = parseInt(args[1]);
            console.log(args[1]);
            break;

        case "out":
        case "<":    
            output.value += memory[getAddr(args[0])] + "\n";
            output.scrollTop = output.scrollHeight;
            break;

        case "outasc":
        case "<*":    
                output.value += String.fromCharCode(memory[getAddr(args[0])]);
                output.scrollTop = output.scrollHeight;
                break;

        case "move":
        case "->":
            console.log("moving from: " +  getAddr(args[1]) + " to: " + getAddr(args[0]));
            memory[getAddr(args[0])] = memory[getAddr(args[1])];
            break; 

        case "add":
        case "+":
            memory[getAddr(args[0])] += memory[getAddr(args[1])];
            break;

        case "addi":
        case "+.":
            memory[getAddr(args[0])] += parseInt(args[1]);
            break;

        case "sub":
        case "-":
            memory[getAddr(args[0])] -= memory[getAddr(args[1])];
            break;

        case "subi":
        case "-=":
            memory[getAddr(args[0])] -= parseInt(args[1]);
            break;

        case "bz":
        case "/0":
            if(memory[getAddr(args[0])] == 0)
            {
                ip = getLabelAddr(args[1]);
                return true;
            }
            break;

        case "bnz":
        case "/!0":
            if(memory[getAddr(args[0])] != 0)
            {
                ip = getLabelAddr(args[1]);
                return true;
            }
            break;

        case "bgt":
        case "/>":
            if(memory[getAddr(args[0])] > memory[getAddr(args[1])])
            {
                ip = getLabelAddr(args[2]);
                return true;
            }
            break;

        case "bgteq":
        case "/>=":
            if(memory[getAddr(args[0])] >= memory[getAddr(args[1])])
            {
                ip = getLabelAddr(args[2]);
                return true;
            }
            break;

        case "ble":
        case "/<":
            if(memory[getAddr(args[0])] < memory[getAddr(args[1])])
            {
                ip = getLabelAddr(args[2]);
                return true;
            }
            break;

        case "blteq":
        case "/<=":
            if(memory[getAddr(args[0])] <= memory[getAddr(args[1])])
            {
                ip = getLabelAddr(args[2]);
                return true;
            }
            break;

        case "h":
        case "hlt":
        case "halt":
            return false;

        case "dump":
            dumpMem(memory);
            break;
    
        default:
            console.log("What's this? " + line);
            break;
    }
    ip++;
    return true;
}

function execute(target, display)
{
    console.clear();

    var outText = document.getElementById(display);
    outText.value = ""; // clear for prev runs

    var program = document.getElementById(target).value;
    var lines = program.split(/(\n|;)/);

    for(i = 0; i < memory.length; i++)
        memory[i] = 0; // fill memory

    // build names
    lines.forEach(line => {
        if(line.match(/\.name \d+ \w+$/))
        {            
            names[line.split(" ")[2]] = parseInt(line.split(" ")[1]);
            lines = lines.filter(item => item != line);
        }
        else if(line.match(/^#/) || line.match(/^\s*$/))
        {
            lines = lines.filter(item => item != line);
        }
    });

    // build labels
    for(i = 0; i < lines.length; i++)
    {
        if(lines[i].match(/^[A-z]+\:\s*$/))
        {
            labels[lines[i].split(":")[0]] = i;
        }
    }

    ip = 0;

    timeout = setInterval(function(){
        if(!executeInstruction(lines[ip], outText))
            clearTimeout(timeout);
    }, 1);

    // for(ip = 0; ip < lines.length;)
    // {
    //     executeInstruction()
    // }

    console.log("done");
}