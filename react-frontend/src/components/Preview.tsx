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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import MyModal from './MyModal';

export default function Preview() {
  const { username } = useParams();
  const location = useLocation();

  const { currentUser } = useAuth();

  const [projects, setProjects] = useState(location?.state?.projectData);
  const [previewUid, setPreviewUid] = useState();
  const [loading, setLoading] = useState(true);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [editProjectProject, setEditProjectProject] = useState("");
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");
  const [editProjectLanguages, setEditProjectLanguages] = useState("");
  const [editProjectCommits, setEditProjectCommits] = useState(0);
  const [editProjectTeamSize, setEditProjectTeamSize] = useState(0);

  // SHOULD DO SOME CHECK TO SEE IF LOCATION HAS STATE, OTHERWISE FETCH
  useEffect(() => {
    const getProjectData = async () => {
      if (location.state == null) {
        const docRef = doc(db, "projects", username ?? "");
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setProjects(docSnap.data()?.includedProjects);
        setPreviewUid(docSnap.data()?.uid);
        setLoading(false);
      }
      setLoading(false);
    }
    getProjectData();
  }, []);

  const handleEditProject = (project: any) => {
    setEditProjectProject(project);
    setEditProjectTitle(projects[project].title);
    setEditProjectDescription(projects[project].summary);
    setEditProjectLanguages(projects[project].languagesString);
    setEditProjectCommits(projects[project].numCommits);
    setEditProjectTeamSize(projects[project].numContributors);
    setShowEditPageModal(true);
  }

  const handleSubmitEdits = async () => {
    setLoading(true);
    setShowEditPageModal(false);
    const docRef = doc(db, `projects/${username}`);
    await updateDoc(docRef, {
      [`includedProjects.${editProjectProject}`]: {
        title: editProjectTitle,
        summary: editProjectDescription,
        languagesString: editProjectLanguages,
        numCommits: editProjectCommits,
        numContributors: editProjectTeamSize
      }
    });
    projects[editProjectProject] = {
      title: editProjectTitle,
      summary: editProjectDescription,
      languagesString: editProjectLanguages,
      numCommits: editProjectCommits,
      numContributors: editProjectTeamSize
    };
    setLoading(false);
  }

  if (loading) {
    return <div>DO LOAING </div>
  }

  return (
    <div id="preview-container" style={{overflow: 'hidden'}}>
      <MyModal
        modalStyle={{width: "50%", height: "80%", padding: "50px", overflow: "scroll"}} 
        show={showEditPageModal} 
        setShow={setShowEditPageModal}
        noClickToClose={true}
      >
        <div className="prev-title-label">Project:</div>
        <textarea className="prev-edit-textarea" value={editProjectTitle} onChange={e => setEditProjectTitle(e.target.value)}/>
        <div className="prev-desc-label">Description</div>
        <textarea className="prev-edit-textarea-desc" value={editProjectDescription} onChange={e => setEditProjectDescription(e.target.value)}/>
        <div className="prev-desc-label">Languages</div>
        <textarea className="prev-edit-textarea-desc" value={editProjectLanguages} onChange={e => setEditProjectLanguages(e.target.value)}/>
        <div className="prev-desc-label">My Commits</div>
        <input type="number" value={editProjectCommits} onChange={e => setEditProjectCommits(Number(e.target.value))}/>
        <div className="prev-desc-label">Team Size</div>
        <input type="number" value={editProjectTeamSize} onChange={e => setEditProjectTeamSize(Number(e.target.value))}/>
        <div className="prev-submit-container">
          <div className="prev-submit-edits" onClick={handleSubmitEdits}>Submit</div>
        </div>
      </MyModal>
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
                  <div className="prev-title">{projects[project].title}</div>
                  <img
                    src={projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                    alt="project preview"
                    className="slide-image-under-title"
                  />
                  <div className="preview-text-not-title-container">
                    <div className="prev-desc">{projects[project].summary}</div>
                    <div className="prev-section">
                      <div className="prev-sec-label">Languages: </div>
                      {' ' + projects[project].languagesString}
                    </div>
                    <div className="prev-section">
                      <div className="prev-sec-label">My Commits: </div>
                      {' ' + projects[project].numCommits}
                    </div>
                    <div className="prev-section">
                      <div className="prev-sec-label">Team Size: </div>
                      {' ' + projects[project].numContributors}
                    </div>
                    {
                      (currentUser != null && currentUser.uid === previewUid) &&
                      <div className="edit-project-button" onClick={() => handleEditProject(project)}>Edit Project</div>
                    }
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
