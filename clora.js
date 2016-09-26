/*
 *  Clora language virtual machine
 *
 *  This code is free, do what ever you want
 */
Clora = function(program) {

    if (program === undefined || typeof program !== 'string') {
        throw 'Invalid clora program';
    }

    this.programs = program.split(';');

    this.useNext = function(program, i) {
        return (program[i + 1] == 'N') || (program[i + 2] == 'N');
    };

    this.evaluate = function(P, I, N, opcode, p1, p2) {
        if (opcode === 'R') { // READ
            if (p1 === 'P') {
                return P;
            }
            if (p1 === 'I') {
                return I;
            }
            if (p1 === 'N') {
                return N;
            }
            return p1;
        }
        if (opcode === 'T'){ //Translate
            return p1[I];
        }
        if (opcode === '=') { // EQUALS
            var v1 = this.evaluate(P, I, N, 'R', p1);
            var v2 = this.evaluate(P, I, N, 'R', p2);
            return v1 == v2;
        }
        if (opcode === '<') { // SMALLER
            var v1 = this.evaluate(P, I, N, 'R', p1);
            var v2 = this.evaluate(P, I, N, 'R', p2);
            return v1 < v2;
        }
        if (opcode === '>') { // BIGGER
            var v1 = this.evaluate(P, I, N, 'R', p1);
            var v2 = this.evaluate(P, I, N, 'R', p2);
            return v1 > v2;
        }

    }

    this.run = function(P, I, N, program) {
        var trueFlag = false;
        var numericMode = false;
        var result = '';

        // Quick check for NEXT variable use
        var skip = false;
        for (var i = 0, l = program.length; i < l; i++) {
            if(program[i] === 'N' && !skip){
                if(N === undefined){
                    return undefined;
                }
            }
            if(program[i] === '['){
                skip = true;
            }
            if(program[i] === ']'){
                skip = false;
            }
        }

        debugger;
        for (var i = 0, l = program.length; i < l; i++) {
            console.log("PIN="+P+'/'+I+'/'+N +" CODE="+program.substr(i));
            if(program[i] === '@'){ // Numeric mode
                numericMode = !numericMode;
                i++;
            }
            if(program[i] === '!'){// Result Input
                result = I;
                i++;
            }
            if(program[i] === '+'){ // ADD
                if(program[i+1] === 'N'){
                    I = I + N;
                }else{
                    I = I + Number.parseInt(program.substr(i+1));
                }
            }
            if(program[i] === '%'){ // Modulus
                if(program[i+1] === 'N'){
                    I = I % N;
                }else{
                    I = I % Number.parseInt(program.substr(i+1));
                }
            }
            if(program[i] === 'T'){ // Translate
                var array = [];
                if(program[i+1] !== '[' ){
                    throw 'You cant translate without an array';
                }
                var buff = '';
                for(var c=i+2; c<l; c++){
                    if(program[c] == ','){
                        if(numericMode){
                            array.push(Number.parseInt(buff));
                        }else{
                            array.push(buff);
                        }
                        buff = '';
                    }else if(program[c] === ']'){
                        break;
                    }else{
                        buff = buff + program[c];
                    }
                    i=c;
                }
                if(numericMode){
                    array.push(Number.parseInt(buff));
                }else{
                    array.push(buff);
                }
                I=this.evaluate(P,I,N,'T',array);
            }
            if ((program[i] == '=' || program[i] == '<' || program[i] == '>') && i + 2 < l) { // Comparators
                trueFlag = this.evaluate(P, I, N, program[i], program[i + 1], program[i + 2]);
                i = i + 3;
            }
            if (program[i] == '?' && i + 2 < l) { // If
                if (trueFlag) {
                    result += program[i + 1];
                } else {
                    result += program[i + 2];
                }
                i = i + 3;
            }

        }

        return result;
    }

    this.executeProgram = function(program, input) {
        if (input === undefined || typeof input !== 'string' || input.length == 0) {
            throw 'Wrong input, it must be a string';
        }

        var P = undefined;
        var result = '';

        if(program[0] === '@'){ // Numeric mode
            input = input.split(' ').map(function(n){
                return Number.parseInt(n);
            });
        }

        for (var inputIterator = 0, inputLength = input.length; inputIterator < inputLength; inputIterator++) {
            var I = input[inputIterator];
            var N = undefined;
            if (inputIterator + 1 < inputLength) {
                N = input[inputIterator + 1];
            }
            var ret = this.run(P, I, N, program);
            if(ret !== undefined){
                result += ret;
            }
            P = I;
        }
        return result;
    }

    this.execute = function(input, callback) {
        for (var i = 0, l = this.programs.length; i < l; i++) {
            var result = this.executeProgram(this.programs[i], input);
            if(result !== undefined){
                callback && callback(result);
            }
        }
    }

};


x = new Clora('<0I?01');
x.execute('10101110101010010100010001010110101001010', function(r){
    console.log("EXPECTED=10101110101010010100010001010110101001010");
    console.log("RESULTED="+r);
});
