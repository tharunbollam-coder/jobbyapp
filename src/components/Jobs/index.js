import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import JobCard from '../JobCard'

import FilterGroup from '../FilterGroup'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesList: [],
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, activeSalaryRangeId, employmentTypesList} = this.state
    const employmentTypes = employmentTypesList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {jobs} = data
      const updatedData = jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={() => this.getJobs()}
      >
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <>
        {jobsList.length > 0 ? (
          <ul className="jobs-list">
            {jobsList.map(eachJob => (
              <JobCard key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  employmentTypesListUpdate = id => {
    const {employmentTypesList} = this.state
    if (employmentTypesList.includes(id)) {
      const newEmploymentList = employmentTypesList.filter(each => each !== id)
      this.setState({employmentTypesList: newEmploymentList}, this.getJobs)
    } else {
      this.setState(
        pre => ({
          employmentTypesList: [...pre.employmentTypesList, id],
        }),
        this.getJobs,
      )
    }
  }

  updateSalaryRangeId = id => {
    this.setState({activeSalaryRangeId: id}, this.getJobs)
  }

  renderSearchBar = searchBarID => {
    const {searchInput} = this.state
    return (
      <div className="search-bar" id={searchBarID}>
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={e => this.setState({searchInput: e.target.value})}
        />
        <button
          className="search-button"
          type="button"
          data-testid="searchButton"
          onClick={() => this.getJobs()}
        >
          <BsSearch className="search-icon" aria-label="search" />
        </button>
      </div>
    )
  }

  renderJobsBasedOnAPiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsApiFailureView()
      default:
        return null
    }
  }

  render() {
    const {profileApiStatus, profileDetails} = this.state

    return (
      <>
        <Header />
        <div className="jobsContainer">
          <div className="c1">
            {this.renderSearchBar('sb1')}
            <ProfileDetails
              profileApiStatus={profileApiStatus}
              profileDetails={profileDetails}
              fun={this.getProfileDetails}
            />
            <FilterGroup
              employmentTypesFunc={this.employmentTypesListUpdate}
              salaryIdUpdateFunc={this.updateSalaryRangeId}
            />
          </div>
          <div className="c2">
            {this.renderSearchBar('sb2')}
            {this.renderJobsBasedOnAPiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
