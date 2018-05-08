import React from 'react'
import Drawer from 'components/common/Drawer'
import Icon from 'components/Icon'
import SearchSuggestions from 'components/autocomplete/SearchSuggestions'
import * as events from 'helpers/emmiter';

export default class Sidebar extends React.Component {
  state = { isOpen: false };
  suggestionsContainer: any;
  input: any;
  isFocused: any;

  componentWillUnmount() {
    this.setState({ isOpen: false });
  }

  componentDidMount() {
    this.setState({ isOpen: true })
    document.addEventListener('focusout', this.handleFocusOut, true)
  }

  handleFocusOut = (e) => {
    e.stopImmediatePropagation()

    if (e.relatedTarget === this.input) {
      this.isFocused = false;
      this.setState({ isOpen: false });
      return;
    }
  }

  handleInputChange = ({ target: { value }}) => {
    // update agent
    this.props.update('q', value)
  }

  componentDidUpdate() {
    this.input && this.input.focus()
  }

  handleExited = () => {
    events.emit('autocompleteFocusLost', this.props.config.get('widgetKey'))
  }

  getInputRef = (el) => {
    this.input = el
  }

  handleSubmit = () => {
    (window as any).findify.emit('search', this.props.config.get('widgetKey'))
  }

  render() {
    const { theme, meta, isMobile, suggestions, config, ...rest } = this.props
    return (
      <Drawer hideModal={this.handleExited}>
        <div className={theme.root} data-findify-autocomplete={true}>
          <div className={theme.backdrop} />
          <div className={theme.header}>
            <form onSubmit={this.handleSubmit}>
              <input
                defaultValue={meta.get('q')}
                ref={this.getInputRef}
                onChange={this.handleInputChange}
                placeholder='What are you looking for?' />
            </form>
            <div className={theme.icons}>
              <Icon
                onClick={this.handleSubmit}
                className={theme.searchIcon}
                name={'Search'}
                width={18}
                height={18} />
              <div className={theme.iconDivider}></div>
              <Icon
                onClick={this.handleExited}
                className={theme.xIcon}
                name={'XMobile'}
                width={13}
                height={13} />
            </div>
          </div>
          <div className={theme.suggestionsWrapper} display-if={suggestions && suggestions.size > 0}>
            <div className={theme.suggestionsContainer} ref={(el) => {this.suggestionsContainer = el}}>
              <h4 className={theme.typeTitle}>{config.getIn(['i18n', 'suggestionsTitle'])}</h4>
              <SearchSuggestions className={theme.searchSuggestions} widgetKey={config.get('widgetKey')} {...rest} />
            </div>
          </div>
        </div>
      </Drawer>
    )
  }
}
