/*
 *  Clora language virtual machine
 *
 *  This code is free, do what ever you want
 */
Clora = function(program) {

    console.log(typeof program);
    console.log(program);
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
            throw 'Undeclared variable ' + p1;
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
        var result = '';

        for (var i = 0, l = program.length; i < l; i++) {
            if ((program[i] == '=' || program[i] == '<' || program[i] == '>') && i + 2 < l) {
                if (this.useNext(program, i) && N === undefined) {
                    break;
                }
                trueFlag = this.evaluate(P, I, N, program[i], program[i + 1], program[i + 2]);
                i = i + 3;
            }
            if (program[i] == '?' && i + 2 < l) {
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

        for (var inputIterator = 0, inputLength = input.length; inputIterator < inputLength; inputIterator++) {
            var I = input[inputIterator];
            var N = undefined;
            if (inputIterator + 1 < inputLength) {
                N = input[inputIterator + 1];
            }
            result += this.run(P, I, N, program);
            P = I;
        }
        return result;
    }

    this.execute = function(input, callback) {
        for (var i = 0, l = this.programs.length; i < l; i++) {
            callback && callback(this.executeProgram(this.programs[i], input));
        }
    }

};
