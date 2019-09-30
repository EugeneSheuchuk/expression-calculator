function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    // check expression for right use brackets
    const checkBrackets = str => {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '(' ) {
                count += 1;
            }
            if (str[i] === ')' ) {
                count -= 1;
            }
            if (count === -1) {
                throw new Error('ExpressionError: Brackets must be paired');
            }
        }
        if (count !== 0) {
            throw new Error('ExpressionError: Brackets must be paired');
        }
    };
    // transform string to array on mathematics actions
    const parseStr = str => {
        const action = ['*', '/', '+', '-'];
        const parse = [];
        let startIndexStr = 0;
        for (let i = 0; i < str.length; i ++) {
            if (action.includes(str[i])) {
                if (action.includes(str[i - 1]) || action.includes(str[i - 2])) {
                    continue;
                }
                parse.push(str.slice(startIndexStr, i).trim());
                parse.push(str[i]);
                startIndexStr = i + 1;
            }
        }
        parse.push(str.slice(startIndexStr).trim());
        return parse;
    };

    const calculateTwoNumber = (one, action, two) => {
        const actions = {
            '*': function(one, two) {
                return one * two;
            },
            '/': function(one, two) {
                if (two === 0) {
                    throw new Error('TypeError: Division by zero.');
                }
                return one / two;
            },
            '+': function(one, two) {
                return one + two;
            },
            '-': function(one, two) {
                return one - two;
            },
        };
        return actions[action](one, two);
    };
    // calculate array
    const calculateParse = arr => {
        let mutableErr = [...arr];
        while (mutableErr.indexOf('/') !== -1) {
            let index = mutableErr.indexOf('/');
            mutableErr = [...mutableErr.slice(0, index - 1),
                calculateTwoNumber(Number(mutableErr[index - 1]), mutableErr[index], Number(mutableErr[index + 1])),
                ...mutableErr.slice(index + 2)];
        }
        while (mutableErr.indexOf('*') !== -1) {
            let index = mutableErr.indexOf('*');
            mutableErr = [...mutableErr.slice(0, index - 1),
                calculateTwoNumber(Number(mutableErr[index - 1]), mutableErr[index], Number(mutableErr[index + 1])),
                ...mutableErr.slice(index + 2)];
        }
        while (mutableErr.indexOf('-') !== -1) {
            let index = mutableErr.indexOf('-');
            mutableErr = [...mutableErr.slice(0, index - 1),
                calculateTwoNumber(Number(mutableErr[index - 1]), mutableErr[index], Number(mutableErr[index + 1])),
                ...mutableErr.slice(index + 2)];
        }
        while (mutableErr.indexOf('+') !== -1) {
            let index = mutableErr.indexOf('+');
            mutableErr = [...mutableErr.slice(0, index - 1),
                calculateTwoNumber(Number(mutableErr[index - 1]), mutableErr[index], Number(mutableErr[index + 1])),
                ...mutableErr.slice(index + 2)];
        }
        return mutableErr;
    };

    checkBrackets(expr);

    //find brackets in string and calculate them
    let parsedStr = expr.trim();
    let countOfBrackets = 0;
    for (let i = 0; i < parsedStr.length; i++) {
        if (expr[i] === '(' ) {
            countOfBrackets += 1;
        }
    }
    while (countOfBrackets !== 0) {
        let leftBorder = parsedStr.indexOf('(');
        let rightBorder = parsedStr.indexOf(')');
        let part = parsedStr.slice(leftBorder + 1, rightBorder);
        while(part.indexOf('(') !== -1) {
            leftBorder = parsedStr.indexOf('(', leftBorder + 1);
            part = parsedStr.slice(leftBorder + 1, rightBorder);
        }
        if (leftBorder === 0) {
            parsedStr = `${calculateParse(parseStr(part))}${parsedStr.slice(rightBorder+1)}`;
            countOfBrackets -= 1;
        } else {
            parsedStr = `${parsedStr.slice(0, leftBorder)}${calculateParse(parseStr(part))}${parsedStr.slice(rightBorder+1)}`;
            countOfBrackets -= 1;
        }
    }
    return calculateParse(parseStr(parsedStr))[0];
}

module.exports = {
    expressionCalculator
};
