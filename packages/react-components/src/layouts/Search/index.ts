import { createElement } from 'react';
import { hot } from 'react-hot-loader';
import { compose, withProps, withStateHandlers, setDisplayName, branch, withHandlers, renderNothing } from 'recompose';
import { connectItems } from '@findify/react-connect';
import withTheme from 'helpers/withTheme';
import withEvents from 'helpers/withEvents';
import withErrorHandler from 'helpers/withErrorHandler';
import { withDrawer } from "helpers/withDrawer";
import MobileFacets from 'components/search/MobileFacets';
import MobileSorting from 'components/search/MobileSorting';

import view from 'layouts/Search/view';
import styles from 'layouts/Search/styles.css';


const transform = {
  from: { transform: `translate3d(-100%, 0, 0)` },
  to: { transform: `translate3d(0%, 0, 0)` },
}

const Search = compose(
  setDisplayName('Search'),

  withTheme(styles),
  
  withErrorHandler,

  connectItems,

  branch(
    ({ items }) => !items.size,
    renderNothing
  ),

  withProps(({ config }) => ({
    isMobile: config.get('forceMobile') || window.innerWidth <= config.get('mobileBreakpoint'),
    filtersOnRight: config.get('filtersOnRight')
  })),

  branch(
    ({ isMobile }) => isMobile,
    compose(
      withProps({ theme: {} }),
      withDrawer('Filters', MobileFacets, transform),
      withDrawer('Sorting', MobileSorting, transform),
      withEvents({
        showMobileFacets: ({ showModal }) => () => showModal('Filters'),
        showMobileSort: ({ showModal }) => () => showModal('Sorting'),
        hideMobileFacets: ({ hideModal }) => () => hideModal('Filters'),
        hideMobileSort: ({ hideModal }) => () => hideModal('Sorting'),
      })
    )
  )
)(view);

export default hot(module)(Search)
