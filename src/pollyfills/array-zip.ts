declare global {
  interface ArrayConstructor {
    zip(...arrays: any[][]): Array<[...any[]]>
  }
}

Array.zip = function (...arrays: any[][]): Array<[...any[]]> {
  const maxLength = Math.max(...arrays.map((arr) => arr.length))
  const result = []

  for (let i = 0; i < maxLength; i++) {
    result.push(
      arrays.reduce((acc, array) => {
        acc.push(array[i])

        return acc
      }, []),
    )
  }

  return result
}
