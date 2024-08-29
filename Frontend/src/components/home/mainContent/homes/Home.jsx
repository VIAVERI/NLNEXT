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
import { useAuth } from '../../../../contexts/AuthContext';

const Homes = () => {
  const { partnerId } = useAuth();
  return (
    <>
      <main>
        <div className='container'>
          <section className='mainContent'>
            <PartnershipRequest />
            <Popular partnerId={partnerId} />
            <Ppost />
            <Life />
            <Music />
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