import * as React from 'react'
const { useState, useEffect } = React
import { Post as PostModel } from '../../models'
import Post from '../Post'

export default ({
  timeline,
  readMore,
  readMoreDisabled
}: {
  timeline: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
}) => {
  const [openModal, setOpenModal] = useState(null as string | null)
  useEffect(() => {
    const watchHistoryBack = () => {
      setOpenModal(null)
      return
    }
    window.addEventListener('popstate', watchHistoryBack)
    return () => {
      window.removeEventListener('popstate', watchHistoryBack)
    }
  }, [])

  return (
    <ul className="timeline">
      {Array.from(Array(Number(!timeline.length) * 10), (v, k) => k).map(
        post => {
          return (
            <li className="timelineItem" key={post}>
              <div className="ph-item">
                <div className="ph-col-4">
                  <div className="ph-row">
                    <div className="ph-col-6" />
                    <div className="ph-col-2 empty" />
                    <div className="ph-col-4" />
                  </div>
                </div>
                <div className="ph-col-8">
                  <div className="ph-row">
                    <div className="ph-col-8 empty" />
                    <div className="ph-col-4" />
                  </div>
                </div>
                <div className="ph-col-12">
                  <div className="ph-row">
                    <div className="ph-col-12 big" />
                  </div>
                </div>
                <div className="ph-col-4">
                  <div className="ph-row">
                    <div className="ph-col-12" />
                  </div>
                </div>
              </div>
            </li>
          )
        }
      )}
      {timeline.map(post => (
        <li className="timelineItem" key={post.id}>
          <Post post={post} setOpenModal={setOpenModal} />
        </li>
      ))}
      {openModal && (
        <>
          <div className="post-image__modal__background" />
          <div
            className="post-image__modal"
            onClick={() => {
              setOpenModal(null)
              history.back()
            }}
          >
            <img
              className="post-image__modal__img"
              src={openModal}
              onClick={() => window.open(openModal, '_blank')}
            />
          </div>
        </>
      )}
      <li className="timelineItem">
        <button
          className="timelineItem__readMore"
          disabled={readMoreDisabled}
          onClick={e => {
            e.preventDefault()
            readMore()
          }}
        >
          READ MORE
        </button>
      </li>
    </ul>
  )
}
