const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('validate min boundary for strings', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('validate max boundary for strings', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 5,
        },
      });

      const errors = validator.validate({name: 'abcdef'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
    });
    it('validate min boundary for numbers', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({age: 17});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });
    it('validate max boundary for numbers', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({age: 11});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 10, got 11');
    });
    it('validator does not check other rules if type mismatch', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });
      const errors = validator.validate({name: 1234});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
    it('correct validation for numbers', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({age: 10});
      expect(errors).to.have.length(0);
    });
    it('correct validation for strings', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 4,
          max: 12,
        },
      });

      const errors = validator.validate({name: 'Dima'});
      expect(errors).to.have.length(0);
    });
  });
});
