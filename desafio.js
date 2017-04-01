"use strict";
// Considere um modelo de informação, onde um registro é representado por uma "tupla".
// Uma tupla (ou lista) nesse contexto é chamado de fato.

// Exemplo de um fato:
// ('joão', 'idade', 18, true)

// Nessa representação, a entidade 'joão' tem o atributo 'idade' com o valor '18'.

// Para indicar a remoção (ou retração) de uma informação, o quarto elemento da tupla pode ser 'false'
// para representar que a entidade não tem mais aquele valor associado aquele atributo.


// Como é comum em um modelo de entidades, os atributos de uma entidade pode ter cardinalidade 1 ou N (muitos).

// Segue um exemplo de fatos no formato de tuplas (E, A, V, added?)
// i.e. [entidade, atributo, valor, booleano indica se fato foi adicionado ou retraido)

var facts = [
  ['gabriel', 'endereço', 'av rio branco, 109', true],
  ['joão', 'endereço', 'rua alice, 10', true],
  ['joão', 'endereço', 'rua bob, 88', true],
  ['joão', 'telefone', '234-5678', true],
  ['joão', 'telefone', '91234-5555', true],
  ['joão', 'telefone', '234-5678', false],
  ['gabriel', 'telefone', '98888-1111', true],
  ['gabriel', 'telefone', '56789-1010', true],
];



// Vamos assumir que essa lista de fatos está ordenada dos mais antigos para os mais recentes.

// Nesse schema,
// o atributo 'telefone' tem cardinalidade 'muitos' (one-to-many), e 'endereço' é 'one-to-one'.
var schema = [
    ['endereço', 'cardinality', 'one'],
    ['telefone', 'cardinality', 'many']
];


// Nesse exemplo, os seguintes registros representam o histórico de endereços que joão já teve:
//  [
//   ['joão', 'endereço', 'rua alice, 10', true]
//   ['joão', 'endereço', 'rua bob, 88', true],
//]
// E o fato considerado vigente é o último.

// O objetivo desse desafio é escrever uma função que retorne quais são os fatos vigentes sobre essas entidades.
// Ou seja, quais são as informações que estão valendo no momento atual.
// A função deve receber `facts` (todos fatos conhecidos) e `schema` como argumentos.

// Resultado esperado para este exemplo (mas não precisa ser nessa ordem):
//[
//  ['gabriel', 'endereço', 'av rio branco, 109', true],
//  ['joão', 'endereço', 'rua bob, 88', true],
//  ['joão', 'telefone', '91234-5555', true],
//  ['gabriel', 'telefone', '98888-1111', true],
//  ['gabriel', 'telefone', '56789-1010', true]
//];

function buildCardinalityMap(schema) {
    var schemaMap = {};
    for (var i=0; i < schema.length; i++) {
        var [attribute, property, value] = schema[i];
        if (property == 'cardinality') {
            schemaMap[attribute] = value;
        }
    }
    return schemaMap
}


function validFactsForMapping(facts, schemaMapping) {
    var oneToManyFacts = new Array();
    var oneToOneFacts = {};
    for (var i = 0; i < facts.length; i++) {
        var [entity, attribute, , valid] = facts[i];
        if (!valid) 
            continue;
        switch (schemaMapping[attribute]) {
            case 'one':
                if (!oneToOneFacts[entity]) {
                    oneToOneFacts[entity] = {};
                }
                oneToOneFacts[entity][attribute] = facts[i];
                break;
            case 'many':
                oneToManyFacts.push(facts[i]);
                break;
            default:
                console.error('Unkonwn cardinality for atribute "%s"', attribute);
        }
    }
    return [oneToManyFacts, oneToOneFacts];
}

function validFacts(facts, schema) {
    var schemaMapping = buildCardinalityMap(schema);
    var [resultingFacts, oneToOneFacts] = validFactsForMapping(facts, schemaMapping);
    for (var entity in oneToOneFacts) {
        for (var attribute in oneToOneFacts[entity]) {
            resultingFacts.push(oneToOneFacts[entity][attribute]);
        }
    }
    return resultingFacts;
}

exports.buildCardinalityMap = buildCardinalityMap;
exports.validFacts = validFacts;

//console.log(validFacts(facts, schema))