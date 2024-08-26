import React from "react"
import { Link } from "react-router-dom"
import Discover from "../../discover/Discover"
import Side from "../../sideContent/side/Side"
import Life from "../life/Life"
import Music from "../musics/Music"
import Popular from "../popular/Popular"
import Ppost from "../Ppost/Ppost"
import PartnershipRequest from "../../PartnershipRequest"
import "./style.css"

const Homes = () => {
  return (
    <>
      <main>
        <div className='container'>
          <section className='mainContent'>
            <PartnershipRequest />
            <Popular />
            <Ppost />
            <Life />
            <Music />
            {/* New link to Partner Profile Creation */}
            <Link
              to="/partner-profile-creation"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                marginTop: '20px'
              }}
            >
              Create Partner Profile
            </Link>
          </section>
          <section className='sideContent'>
            <Side />
          </section>
        </div>
      </main>
    </>
  )
}

export default Homes