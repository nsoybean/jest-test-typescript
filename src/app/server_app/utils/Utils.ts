import { IncomingMessage } from 'http'

export async function getRequestBody(request: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    // pattern is (event, cb). Look at how test is implemented for this file.
    request.on('data', (data: string) => {
      body += data
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (jsonError) {
        reject(jsonError)
      }
    })
    request.on('error', (error: any) => {
      reject(error)
    })
  })
}
