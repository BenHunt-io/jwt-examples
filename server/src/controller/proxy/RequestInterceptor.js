

/**
 * Intercepts http requests and sets headers.
 * 
 * Handles pre-flight requests that asks about allowable operations and data.
 * @param {*} req 
 * @returns The http response
 */
function intercept(func){

    return function (req, res) {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Content-Type", "application/json;charset=utf8");
        
        if(req.method == 'OPTIONS'){
            res.statusCode = 200;
            res.end();
            return;
        }

        // we can reference 'func' because it is stored in the outer functions scope.
        let response = func.apply(this, [req, res]);

        return response;
    }

}


module.exports = { intercept } ;