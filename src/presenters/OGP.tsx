import * as React from 'react'
const { useState, useEffect } = React
import Axios from 'axios'

import { OGP } from '../models/post'

export default ({ link }: { link: string }) => {
  const [ogp, setOGP] = useState(null as OGP | null)
  useEffect(() => {
    Axios.get('https://ricapitolare.now.sh/fetch', {
      params: {
        url: link
      }
    })
      .then(resp => {
        setOGP(new OGP(resp.data))
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <>
      {ogp ? (
        <div className="post__ogp">
          <a href={link} target="_blank" rel="noreferrer">
            <div className="post__ogp__title">{ogp.title}</div>

            {ogp.description && (
              <div className="post__ogp__description">
                {128 <= ogp.description.length
                  ? ogp.description.substring(0, 128).concat('…')
                  : ogp.description}
              </div>
            )}
          </a>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
