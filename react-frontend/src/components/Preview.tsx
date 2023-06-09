import './Preview.css'
import React, {
  useState,
  useEffect
} from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { prevWaves } from '../icons/Waves';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Preview() {
  const { username } = useParams();
  const location = useLocation();

  const { currentUser } = useAuth();

  const [projects, setProjects] = useState(location?.state?.projectData);
  const [loading, setLoading] = useState(true);

  // SHOULD DO SOME CHECK TO SEE IF LOCATION HAS STATE, OTHERWISE FETCH
  useEffect(() => {
    const getProjectData = async () => {
      if (currentUser == null) {
        return;
      }
      if (location.state == null) {
        const docRef = doc(db, "projects", username ?? "");
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setProjects(docSnap.data()?.includedProjects);
        setLoading(false);
      }
      setLoading(false);
    }
    getProjectData();
  }, [currentUser]);

  if (loading) {
    return <div>DO LOAING </div>
  }

  return (
    <div id="preview-container" style={{overflow: 'hidden'}}>
      {/* {username} */}
      {/* <>
        {JSON.stringify(location.state.projectData)}
      </> */}
      <Swiper
        navigation={true}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
        style={{ height: '100%' }}
        // allowTouchMove={false}
      >
        {
          Object.keys(projects).map((project, idx) => (
            <SwiperSlide className="preview-slide">
              <div className="prev-hor-container">
                <img
                  src={projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                  alt="project preview"
                  className="slide-image"
                />
                <div className="preview-text-container">
                  <div className="prev-title">{project}</div>
                  <img
                    src={projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                    alt="project preview"
                    className="slide-image-under-title"
                  />
                  <div className="preview-text-not-title-container">
                    <div className="prev-desc">{projects[project].summary}</div>
                    <div className="prev-section">
                      <div className="prev-sec-label">Languages: </div>
                      {' ' + Object.keys(projects[project].languages).map(lang => ' ' + lang)}
                    </div>
                    <div className="prev-section">
                      <div className="prev-sec-label">My Commits: </div>
                      {' ' + projects[project].numCommits}
                    </div>
                    <div className="prev-section">
                      <div className="prev-sec-label">Team Size: </div>
                      {' ' + projects[project].numContributors}
                    </div>
                    <div className="padding"/>
                  </div>
                </div>
              </div>
              <div className="prev-wave">
                {prevWaves[idx % 4]}
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}
