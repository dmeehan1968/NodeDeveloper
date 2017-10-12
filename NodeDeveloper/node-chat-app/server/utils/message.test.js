const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {

  it('should generate the correct message object', () => {

    var from = 'Dave';
    var text = 'This is a test';

    var message = generateMessage(from, text);

    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(message.createdAt).toBeA('number');

  });

});

describe('generateLocationMessage', () => {

  it('should generate the correct location message object', () => {

    var from = 'Dave';
    var lat = 54.7773642;
    var lng = -5.7625231
    var message = generateLocationMessage(from, lat, lng);

    expect(message.from).toBe(from);
    expect(message.url).toBe(`https://www.google.com/maps?q=${lat},${lng}`);
    expect(message.createdAt).toBeA('number');

  });

});
