import React, { Component } from 'react';
import { Sidebar, Header } from 'semantic-ui-react';

import './Sidebar.css';

import GeneralIndex from './components/GeneralIndex';
import RegionList from './components/RegionList';

import General from './components/General';
import Region from './components/Region';
import Pref from './components/Pref';

export default class WeatherInfoSidebar extends Component {
  state = { show: null }; // { type, code }

  render() {
    return (
      <Sidebar
        animation='overlay'
        direction='right'
        className='sidebar-dark'
        inverted='true'
        vertical='true'
        visible>
        {this.state.show ? this.renderShow() : this.renderIndex()}
      </Sidebar>
    );
  }

  renderIndex() {
    return (
      <div>
        <Header as='h2'>気象情報</Header>
        {this.props.data ?
          <>
            <GeneralIndex
              info={this.props.data.general}
              period={this.props.period}
              onClick={() => this.setState({ show: { type: 'general' } })}
            />
            <RegionList
              regions={this.props.data.regions}
              period={this.props.period}
              onClick={(code) => this.setState({ show: { type: 'region', code } })}
            />
          </>
        : null}
      </div>
    );
  }

  showPref(code) {
    this.setState({ show: { type: 'pref', code } });
  }

  renderShow() {
    const show = this.state.show;
    console.log(show);
    if (show.type === 'general') {
      return this.renderGeneral();

    } else if (show.type === 'region') {
      return this.renderRegion(show.code);

    } else if (show.type === 'pref') {
      return this.renderPref(show.code);
    }
  }
  
  renderGeneral() {
    if (this.props.data && this.props.data.general) {
      return (
        <General info={this.props.data.general} />
      );
    }
  }
  
  renderRegion(code) {
    if (this.props.data && this.props.data.regions[code]) {
      return (
        <Region info={this.props.data.regions[code]} />
      );
    }
  }

  renderPref(code) {
    if (this.props.data && this.props.data.prefs[code]) {
      return (
        <Pref info={this.props.data.prefs[code]} />
      );
    }
  }
}

