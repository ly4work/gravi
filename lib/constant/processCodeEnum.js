/**
 * processCodeEnum 进程终止 状态码
 * @author
 * 2021/
 */

module.exports = {
  //  0 成功退出
  Success: 0,

  //  1 未捕获的致命异常 Uncaught Fatal Exception
  UncaughtException: 1,

  //  2 未使用 Unused （bash保留） reserved by Bash for builtin misuse
  UnusedBash: 2,

  //  3 解析错误 Internal JavaScript Parse Error
  JSParseError: 3,

  //  4 评估失败 Internal JavaScript Evaluation Failure
  JSEvaluationError: 4,

  //  5 致命错误 Fatal Error
  FatalError: 5,

  //  6 未正确的异常处理 Non-function Internal Exception Handler
  NonFunctionException: 6,

  //  7 异常处理函数运行时失败 Internal Exception Handler Run-Time Failure
  HandlerRunTimeException: 7,

  //  8 未使用 未捕获 Unused exit code 8 sometimes indicated an uncaught exception
  UnusedNode: 8,

  //  9 无效的参数 Invalid Argument
  InvalidArgs: 9,

  //  10 运行时失败 Internal JavaScript Run-Time Failure
  RunTimeException: 10,

  //  12 无效的调试参数 Invalid Debug Argument
  InvalidDebugArgs: 12,

  //  128 信号退出 Signal Exits
  SignalExits: 128
};
