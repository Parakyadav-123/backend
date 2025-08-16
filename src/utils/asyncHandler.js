const asynchandler = (requesthandler)=> {
    return (req,res,next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))

    }
}



export {asynchandler}


// const asynchandler = ()=> {}
// const asynchandler = (fn)=> {() => {}}
// const asynchandler = (fn)=> async () => {}

// const asynchandler = (fn) => async(req  , res , next) => {






