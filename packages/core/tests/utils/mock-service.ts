import { ServerResponse, createServer } from 'node:http'


async function flushDataToResponse(
  res: ServerResponse,
  chunks: { value: object }[],
  suffix?: string
) {
  let resolve = () => {}
  let waitForDrain = new Promise<void>(res => (resolve = res))
  res.addListener('drain', () => {
    resolve()
    waitForDrain = new Promise<void>(res => (resolve = res))
  })

  try {
    for (const item of chunks) {
      const data = `data: ${JSON.stringify(item.value)}\n\n`
      const ok = res.write(data)
      if (!ok) {
        await waitForDrain
      }

      await new Promise(r => setTimeout(r, 100))
    }
    if (suffix) {
      const data = `data: ${suffix}\n\n`
      res.write(data)
    }
  } catch (e) {}
  res.end()
}

export const setup = () => {
  let recentFlushed: any[] = []

  const server = createServer((req, res) => {
    const service = req.headers['x-mock-service'] || 'openai'
                value =>
                  new Proxy(
                    { value },
                    {
                      get(target) {
                        recentFlushed.push(target.value)
                        return target.value
                      }
                    }
                  )
              ),
              '[DONE]'
            )
            break
          default:
            throw new Error(`Unknown service: ${service}`)
        }
        break
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  })

  server.listen(3030)

  return {
    port: 3030,
    api: 'http://localhost:3030',
    teardown: () => {
      server.close()
    },
    getRecentFlushed: () => recentFlushed
  }
}
