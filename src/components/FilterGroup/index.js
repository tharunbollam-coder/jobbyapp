import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const FilterGroup = props => {
  const {employmentTypesFunc, salaryIdUpdateFunc} = props

  const employmentFilter = event => {
    employmentTypesFunc(event.target.value)
  }

  const salaryRangeFilter = event => {
    salaryIdUpdateFunc(event.target.value)
  }

  const renderEmploymentTypes = () => (
    <div>
      <hr className="separator" />
      <h1 className="filterHeading">Type of Employment</h1>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId} className="fil">
          <input
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            onClick={employmentFilter}
          />
          <label htmlFor={each.employmentTypeId} className="labelFilterGroup">
            {each.label}
          </label>
        </li>
      ))}
    </div>
  )

  const renderSalaryRange = () => (
    <div>
      <hr className="separator" />
      <h1 className="filterHeading">Salary Range</h1>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId} className="fil">
          <input
            name="salary"
            id={each.salaryRangeId}
            type="radio"
            onClick={salaryRangeFilter}
            value={each.salaryRangeId}
          />
          <label htmlFor={each.salaryRangeId} className="labelFilterGroup">
            {each.label}
          </label>
        </li>
      ))}
    </div>
  )

  return (
    <div>
      {renderEmploymentTypes()}
      {renderSalaryRange()}
    </div>
  )
}

export default FilterGroup
