import type { NextFunction, Request, Response } from 'express'

export function responseWrapper(_req: Request, res: Response, _next: NextFunction) {
  function fail(message?: string): void
  function fail<T>(data: Express.Data<T>): void
  function fail(arg?: any): void {
    if (typeof arg === 'string' || typeof arg === 'undefined') {
      res.json({ success: false, message: arg || '' })
    }
    else {
      res.json({ success: false, ...arg })
    }
  }

  res.fail = fail

  res.success = (data: Express.Data) => res.json({ success: true, message: data.message || '', data: data?.data })

  _next()
}
