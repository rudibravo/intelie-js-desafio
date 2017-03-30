var desafio = require('../desafio');

exports['buildCardinalityMap'] = function (test) {
    var schema = [
        ['endereço', 'cardinality', 'one'],
        ['telefone', 'cardinality', 'many'],
        ['cpf', 'cardinality', 'one'],
        ['foo', 'bar', 'one'],
    ];
    var schemaMap = desafio.buildCardinalityMap(schema);
    test.equal(schemaMap['endereço'], 'one')
    test.equal(schemaMap['telefone'], 'many')
    test.equal(schemaMap['cpf'], 'one')
    test.equal(schemaMap['foo'], undefined)
    test.done();
}

exports['replaceFact'] = function (test) {
    var facts = [
        ['joão', 'telefone', '9999-9999', true],
        ['joão', 'endereço', 'rua alice, 10', true],
    ]
    var fact = ['joão', 'endereço', 'rua bob, 88', true];
    var newFacts = desafio.replaceFact(fact, facts);
    test.equal(newFacts.length, 2);
    test.equal(newFacts[1][0], 'joão');
    test.equal(newFacts[1][1], 'endereço');
    test.equal(newFacts[1][2], 'rua bob, 88');
    test.equal(newFacts[1][3], true);
    test.done();
}

exports['validFacts'] = function (test) {
    var facts = [
        ['gabriel', 'endereço', 'av rio branco, 109', true],
        ['joão', 'endereço', 'rua alice, 10', true],
        ['joão', 'endereço', 'rua bob, 88', true],
        ['joão', 'telefone', '234-5678', true],
        ['joão', 'telefone', '91234-5555', true],
        ['joão', 'telefone', '234-5678', false],
        ['gabriel', 'telefone', '98888-1111', true],
        ['gabriel', 'telefone', '56789-1010', true],
        ['joão', 'foo', 'bar', true],
        ['joão', 'foo', 'bar#2', true],
        ['gabriel', 'bogus', 'ignore', true],
    ];

    var schema = [
        ['endereço', 'cardinality', 'one'],
        ['foo', 'cardinality', 'one'],
        ['telefone', 'cardinality', 'many']
    ];

    var validFacts = desafio.validFacts(facts, schema);

    var expectedFacts = [
        ['gabriel', 'endereço', 'av rio branco, 109', true],
        ['joão', 'endereço', 'rua bob, 88', true],
        ['joão', 'telefone', '234-5678', true],
        ['joão', 'telefone', '91234-5555', true],
        ['gabriel', 'telefone', '98888-1111', true],
        ['gabriel', 'telefone', '56789-1010', true],
        ['joão', 'foo', 'bar#2', true],
    ];

    test.deepEqual(validFacts, expectedFacts);
    test.done();
}