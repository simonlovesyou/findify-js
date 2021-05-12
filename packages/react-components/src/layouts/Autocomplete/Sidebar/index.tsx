import styles from 'layouts/Autocomplete/Sidebar/styles.css';
import { useQuery, useSuggestions } from '@findify/react-connect';
import { useCallback, useEffect, useRef } from 'react';
import Drawer from 'components/common/Drawer';
import Icon from 'components/Icon';
import useTranslations from 'helpers/useTranslations';
import { Products, Suggestions } from 'layouts/Autocomplete/Dropdown';

export default ({ theme = styles, config }) => {
  const { suggestions, update } = useSuggestions();
  const { query } = useQuery();
  const translate = useTranslations();
  const input = useRef<HTMLInputElement>(null);
  const isTrendingSearches = !query.get('q');

  const onExit = useCallback(() => {
    (window as any).findify.emit(
      'autocompleteFocusLost',
      config.get('widgetKey')
    );
  }, []);

  const onSubmit = useCallback(() => {
    (window as any).findify.emit(
      'search',
      config.get('widgetKey'),
      input.current?.value
    );
    onExit();
  }, []);

  const onInputChange = useCallback((e) => {
    const { value } = e.target;
    update('q', value);
  }, []);

  const onFocusOut = useCallback((e) => {
    e.stopImmediatePropagation();
    if (e.relatedTarget !== input.current) return;
  }, []);

  useEffect(() => {
    if (input.current) input.current?.focus();
    document.addEventListener('focusout', onFocusOut, true);
    return () => {
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <Drawer hideModal={onExit}>
      <div className={theme.root} data-findify-autocomplete={true} tabIndex={0}>
        <div display-if={config.get('overlay')} className={theme.backdrop} />
        <div className={theme.header}>
          <form onSubmit={onSubmit}>
            <input
              defaultValue={query.get('q')}
              className={theme.input}
              ref={input}
              onChange={onInputChange}
              placeholder={translate('autocomplete.placeholder')}
            />
          </form>
          <div className={theme.icons}>
            <Icon
              onClick={onSubmit}
              className={theme.searchIcon}
              name={'Search'}
              width={18}
              height={18}
            />
            <div className={theme.iconDivider} />
            <Icon
              onClick={onExit}
              className={theme.xIcon}
              name={'XMobile'}
              width={13}
              height={13}
            />
          </div>
        </div>

        <section className={theme.content}>
          <div className={theme.suggestions}>
            <Suggestions
              display-if={
                config.getIn(['suggestions', 'display']) &&
                suggestions?.size > 0
              }
              theme={theme}
              config={config}
              isTrendingSearches={isTrendingSearches}
            />
          </div>
          <div className={theme.products}>
            <Products
              display-if={config.getIn(['productMatches', 'display'])}
              theme={theme}
              config={config}
              isTrendingSearches={isTrendingSearches}
              padded
            />
          </div>
        </section>
      </div>
    </Drawer>
  );
};