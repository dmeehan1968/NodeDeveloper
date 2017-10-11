const expect = require('expect');
const { generateMessage } = require('./message');

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
