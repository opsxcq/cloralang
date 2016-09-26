# Clora Programming Language 

Clora Programming Language for Code Golfing

## About Clora

Clora is a code golf, in development language, its virtual machine run in javascript, so it browser and node compatible.

## Usage

Just include the clora.js file on your appliation and:

```

 clora = new Clora('=IN?a '); // Create a clora instance of a program
 clora.execute('AA', function(result){
    console.log(result);    
 }); // Executes the clora program for AA input, and give a callback for its result


```

## How to code

Clora is a simple ```instruction:arguments``` based language, with global flags registers and global variables


## Global variables

The list of global variables:

* ```I``` current input character
* ```N``` next input character, if using N, it must be define, or that instruction will terminate the program execution
* ```P previous input character, it can be undefined

## Instructions

Currently clora only use comparation instructions to determine it's code flow, those instructions

* ```=``` equality test, test if parameters 1 and 2 are equals, example ```=IN```, will set the global flag to true, if current input character is equals to the next character, if it exists
* ```>```  test if parameter 1 is bigger than parameter 2 ```>IN```, will set the global flag to true, if current input character is bigger than the next character, if it exists
* ```<```  test if parameter 1 is smaller than parameter 2, example ```<IN```, will set the global flag to true, if current input character is smaller than the next character, if it exists
* ```?``` if global flag is set, output parameter 1, else, output parameter 2
* ```T``` Transform the Input value into an value from an array defined by [elements]
* ```+``` Add to Input value
* ```%``` Apply modulus to the input value
* ```!``` Use Input value as Output
* ```@``` Parse input as a list of numbers

## Multiprograms

Clora can run multiple programs with the same input, you can separate every program with a ```;```, as ```program1;program2;program3```

