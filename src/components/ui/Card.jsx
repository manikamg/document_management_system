import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({title, value, color, icon, link}) => {
    return (
        <div className="col-md-4 mb-3">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className="text-muted mb-1">{title}</p>
                            <h2 className="mb-0">{value}</h2>
                        </div>
                        <div className={`text-${color}`}>
                            {icon}
                        </div>
                    </div>
                    <Link to={link} className="btn btn-sm btn-outline-primary mt-3">
                        View Details <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Card