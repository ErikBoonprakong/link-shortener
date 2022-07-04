import React from 'react'
import './App.css'

class App extends React.Component {
  state = { success: undefined, links: 'URL Links: ' }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    let isPrivate
    if (event.target.id === 'private') {
      isPrivate = true
    }

    const url = `https://${this.state.value}`

    try {
      let response
      if (isPrivate) {
        response = await this.postData('http://localhost:8080/shortlinks', {
          fullUrl: url,
          isPrivate: true
        })
      } else {
        response = await this.postData('http://localhost:8080/shortlinks', {
          fullUrl: url,
          isPrivate: false
        })
      }

      if (response.status >= 400 && response.status < 600) {
        throw new Error('Bad response from server')
      }

      if (response.status === 200) {
        const jsonResponse = await response.json()
        this.setState({
          success: true,
          value: '',
          code: jsonResponse.shortcode
        })
      } else {
        this.setState({ success: false, error: response.error })
      }
    } catch (error) {
      this.setState({ success: false, error: error.toString() })
    }
    await this.getShortcodes()
  }

  async postData(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return response
  }

  // shortcode() {
  //   let shortcodeList = this.getShortcodes()
  //   console.log(shortcodeList)
  // }

  async getShortcodes() {
    const localResponse = await fetch('http://localhost:8080/urls')
    const shortcodeList = await localResponse.json()
    let visitResponse = await fetch('http://localhost:8080/visits')
    let visitCountList = await visitResponse.json()
    let visitData = JSON.stringify(visitCountList.data)
    visitData = visitData.toString().replace('{', '').replace('}', '')
    let linkData = JSON.stringify(shortcodeList.data)
    linkData = linkData
      .toString()
      .replace('{', '')
      .replace('}', '')
      .replaceAll('"', '')
      .replaceAll(':', ' = ')
      .replaceAll('https = ', 'https:')
      .replaceAll('http = ', 'http:')
    const splitVisits = visitData.split(',')
    const splitLinks = linkData.split(',')
    let answer = 'URL Links: \n'
    for (let i = 0; i < splitLinks.length; i++) {
      let s = ''
      if (splitVisits[i].slice(7, splitVisits[i].length) !== '1') {
        s = 's'
      }
      answer +=
        splitLinks[i] +
        ' ----- This link has been visited ' +
        splitVisits[i].slice(7, splitVisits[i].length) +
        ' time' +
        s +
        '\n'
    }
    this.setState({ links: answer })
  }

  render() {
    const { value, code, error } = this.state

    return (
      <div id="centre">
        <h1>Very Good™️ Link Shortener Service</h1>
        <form>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon3">
              https://
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              value={value}
              onChange={(event) => this.handleChange(event)}
            />
          </div>
          <button
            id="public"
            type="button"
            className="btn btn-primary btn-lg"
            onClick={(event) => this.handleSubmit(event)}
          >
            Shorten
          </button>
          &nbsp;
          <button
            id="private"
            type="button"
            className="btn btn-primary btn-lg"
            onClick={(event) => this.handleSubmit(event)}
          >
            Shorten Privately
          </button>
          <br />
          <br />
          {code ? (
            <div className="alert alert-success" role="alert">
              URL has been shortened! You can find it at localhost:8080/l/{code}
            </div>
          ) : null}
          {error ? (
            <div className="alert alert-danger" role="alert">
              Oops! Something went wrong. Error: "{error}".
            </div>
          ) : null}
        </form>
        <div className="shortcodeList display-linebreak">
          {this.state.links}
        </div>
      </div>
    )
  }
}

export default App
