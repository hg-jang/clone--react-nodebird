import React from 'react'
import PropTypes from 'prop-types'

const PostImages = ({ images }) => {
  return (
    <div>포스트 이미지스</div>
  )
}

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object)
}

export default PostImages