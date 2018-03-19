import { compose, setDisplayName, withPropsOnChange } from 'recompose';
import sizeMe from 'react-sizeme';

import view from './view';
import { connectConfig } from '@findify/react-connect';

const countProductsToShow = width => {
  if (width > 1000) return 2;
  if (width > 800) return 3;
  if (width > 600) return 4;
  if (width > 400) return 6;
  return 12;
};

export default compose(
  setDisplayName('StaticResults'),

  connectConfig,

  sizeMe(),

  withPropsOnChange(['size'], ({ size, config }) => ({
    columns: String(config.get('columns') || countProductsToShow(size.width))
  }))
)(view);
