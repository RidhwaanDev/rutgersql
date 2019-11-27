// the most advanced logger ever
let LOG_LEVEL = 0;
const log = console.log;

class Log{
    l(s){
        if(LOG_LEVEL === 1){
            log(s);
        }
    }
    static get LOG_LEVEL(){
        return LOG_LEVEL;
    }
    static set LOG_LEVEL(l){
        LOG_LEVEL = l;
    }
}

module.exports = Log;
