

// test('toHex', () => {

//     let textEncoder = new TextEncoder('utf-8');
//     let utf8_encoded = textEncoder.encode("apple"); // 97, 112, 112, 108, 101
//     let buffer = utf8_encoded.buffer;
//     let base64_encoded = buffer.toString("base64"); // 61 70 70 6c 65


//     let base64enc = Buffer.from("a").toString('base64'); // 0

    
//     expect(base64enc).toStrictEqual('a');


//     // expect(utf8_encoded).toStrictEqual(new Uint8Array([97, 112, 112, 108, 101]));
//     expect(Buffer.from(base64enc, 'base64')).toStrictEqual('');


// })

// test('toHex', () => {

//     let buffer = Buffer.from('apple');
//     let binString = "";

//     for(let [idx, byte] of buffer.entries()){
//         binString += byte.toString(2);
//     }

//     let sixBitArr = [];
//     for(let i = 0; i<binString.length; i+=6){
//         sixBitArr.push(binString.slice(i, i+6))
//     }

//     sixBitArr[sixBitArr.length-1] = sixBitArr[sixBitArr.length-1].padEnd(6, '0');

//     // if(binString.length % 6 != 0){
//     //     let start = binString.length - (binString.length % 6);
//     //     binString.slice(start, binString.length)
//     //     sixBitArr.push(binString.slice(start, binString.length))
//     // }

//     let sixBitNums = [];
//     sixBitArr.forEach(sixBits => {
//         sixBitNums.push(Number.parseInt(sixBits, 2));
//     })

//     // w8OGzK
//     // 48, 60, 14, 6, 51, 10
//     console.log(sixBitNums);
//     console.log(Buffer.from(sixBitNums).toString('binary'));

//     console.log(Buffer.from(sixBitNums));
//     console.log(Buffer.from(sixBitNums).toString("base64"));





// })

test("BufferTest", () => {

    console.log(Number(48).toString(2))
    console.log(Buffer.from([0xFF]).readUint8(0));
    console.log(Buffer.from([0xFF]).readUintBE(0, 1));
    console.log(Buffer.from([]).toString("base64"));


})

