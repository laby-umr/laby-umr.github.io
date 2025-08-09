import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Comments from '../../../components/Comments';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <Comments />
    </>
  );
} 