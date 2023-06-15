import './Preview.css'
import React, {
  useState,
  useEffect
} from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { prevWaves } from '../icons/Waves';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import MyModal from './MyModal';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ClimbingBoxLoader } from 'react-spinners';

export default function Preview() {

  let navigate = useNavigate();
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
  const [editProjectImage, setEditProjectImage] = useState("");

  const [showFunStuffModal, setShowFunStuffModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("http://localhost:3000/basketbla");
  const [previewUrlCopied, setPreviewUrlCopied] = useState(false);
  const [iframe, setIframe] = useState(`<iframe id="github-preview-iframe" src="http://localhost:3000/basketbla">`);
  const [iframeCopied, setIframeCopied] = useState(false);
  const [iframeStyle, setIframeStyle] = useState(`#github-preview-iframe {
    width: 600px;
    height: 300px;
    border: none;
    border-radius: 20px;
  }`);
  const [iframeStyleCopied, setIframeStyleCopied] = useState(false);

  const [wavesEnabled, setWavesEnabled] = useState(true);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // SHOULD DO SOME CHECK TO SEE IF LOCATION HAS STATE, OTHERWISE FETCH
  useEffect(() => {
    const getProjectData = async () => {
      if (location.state == null) {
        const docRef = doc(db, "projects", username ?? "");
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setProjects(docSnap.data()?.includedProjects);
        setPreviewUid(docSnap.data()?.uid);
        setWavesEnabled(docSnap.data()?.wavesEnabled);
        setLoading(false);
      }
      setLoading(false);
    }
    getProjectData();
  }, []);

  const handleEditProject = (project: any) => {
    setEditProjectProject(project);
    setEditProjectImage(projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c");
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
        numContributors: editProjectTeamSize,
        image: editProjectImage,
      }
    });
    projects[editProjectProject] = {
      title: editProjectTitle,
      summary: editProjectDescription,
      languagesString: editProjectLanguages,
      numCommits: editProjectCommits,
      numContributors: editProjectTeamSize,
      image: editProjectImage,
    };
    setLoading(false);
  }

  const updateProjectPic = async (projectPicFile: any, project: any) => {

    // Using firebase cloud storage for project pic
    const storageRef = ref(storage, 'projectPic/' + currentUser.uid + '/' + project);
    const uploadSnapshot = await uploadBytes(storageRef, projectPicFile);
    const newPicUrl = await getDownloadURL(storageRef);

    setEditProjectImage(newPicUrl);
  }

  const copyPreviewUrl = () => {
    navigator.clipboard.writeText(previewUrl);
    setPreviewUrlCopied(true);
  }
  const copyIframe = () => {
    navigator.clipboard.writeText(iframe);
    setIframeCopied(true);
  }
  const copyIframeStyle = () => {
    navigator.clipboard.writeText(iframeStyle);
    setIframeStyleCopied(true);
  }

  const handleCheckWaves = (e: any) => {
    setWavesEnabled(e.target.checked);

    const docRef = doc(db, `projects/${username}`);
    updateDoc(docRef, {
      wavesEnabled: e.target.checked,
    });

  }

  const handleRemoveProject = async () => {
    setShowRemoveConfirmModal(false);
    setShowEditPageModal(false);
    setShowLoadingModal(true);

    const docRef = doc(db, "projects", username ?? "");
    let projectsCopy = projects;
    delete projectsCopy[editProjectProject];
    setProjects(projectsCopy);
    await updateDoc(docRef, {
      includedProejcts: projectsCopy
    });

    setShowLoadingModal(false);
  }

  if (loading) {
    return <div>DO LOAING </div>
  }

  return (
    <div id="preview-container" style={{overflow: 'hidden'}}>
      {
        (currentUser != null && currentUser.uid === previewUid && !showFunStuffModal) &&
        <div className="fun-button" onClick={() => setShowFunStuffModal(true)}>
          <ion-icon name="clipboard-outline" style={{fontSize: '2rem', color: "grey"}}/>
        </div>
      }
      <MyModal 
        modalStyle={{width: "50%", height: "80%", padding: "50px", overflow: "scroll"}}
        show={showFunStuffModal} 
        setShow={setShowFunStuffModal}
      >
        <div id="preview-url-label-container">
            <div id="copy-url-container" onClick={copyPreviewUrl}>
              {
                previewUrlCopied ?
                <>
                  <ion-icon name="checkmark-outline" id="url-copied-check" style={{fontSize: '1.5rem'}}/>
                  Copied!
                </>
                :
                <>
                  <ion-icon name="copy-outline" id="copy-url-button" style={{fontSize: '1.5rem'}}></ion-icon>
                  Copy URL
                </>
              }
            </div>
          </div>
          <div className="preview-url">
            {previewUrl}
          </div>
          <div id="preview-url-label-container">
            <div id="copy-url-container" onClick={copyIframe}>
              {
                iframeCopied ?
                <>
                  <ion-icon name="checkmark-outline" id="url-copied-check" style={{fontSize: '1.5rem'}}/>
                  Copied!
                </>
                :
                <>
                  <ion-icon name="copy-outline" id="copy-url-button" style={{fontSize: '1.5rem'}}></ion-icon>
                  Copy Iframe
                </>
              }
            </div>
          </div>
          <div className="preview-url">
            {iframe}
          </div>
          <div id="preview-url-label-container">
            <div id="copy-url-container" onClick={copyIframeStyle}>
              {
                iframeStyleCopied ?
                <>
                  <ion-icon name="checkmark-outline" id="url-copied-check" style={{fontSize: '1.5rem'}}/>
                  Copied!
                </>
                :
                <>
                  <ion-icon name="copy-outline" id="copy-url-button" style={{fontSize: '1.5rem'}}></ion-icon>
                  Copy Iframe Example Style
                </>
              }
            </div>
          </div>
          <div className="preview-url">
            {iframeStyle}
          </div>
          <div className="waves-enabled-container">
            <div className="waves-enabled-label">Waves Enabled</div>
            <input type="checkbox" checked={wavesEnabled} className="waves-enabled-check" onChange={handleCheckWaves}/>
          </div>
          <div className="reselect-projects-button" onClick={() => navigate('/select-projects')}>
            Reselect Projects
          </div>
      </MyModal>
      <MyModal
        modalStyle={{width: "50%", height: "80%", padding: "50px", overflow: "scroll"}} 
        show={showEditPageModal} 
        setShow={setShowEditPageModal}
        noClickToClose={true}
      >
        <div className="prev-title-label">Project:</div>
        <textarea className="prev-edit-textarea" value={editProjectTitle} onChange={e => setEditProjectTitle(e.target.value)}/>
        <input type="file" id="profile-pic-file-input" style={{display: 'none'}} onChange={(e) => updateProjectPic(e.target.files?.[0], editProjectProject)}></input>
        <div className="project-pic-label">Preview Image:</div>
        <div className="edit-project-pic-section">
          <img className="edit-project-pic-pic" src={editProjectImage} alt="project pic" onClick={() => {document.getElementById('profile-pic-file-input')?.click()}}/>
          <div className="edit-project-pic-text">
            <div className="edit-project-pic-button" onClick={() => {document.getElementById('profile-pic-file-input')?.click()}}>Select New Image</div>
          </div>
        </div>
        <div className="prev-desc-label">Description</div>
        <textarea className="prev-edit-textarea-desc" value={editProjectDescription} onChange={e => setEditProjectDescription(e.target.value)}/>
        <div className="prev-desc-label">Languages</div>
        <textarea className="prev-edit-textarea-desc" value={editProjectLanguages} onChange={e => setEditProjectLanguages(e.target.value)}/>
        <div className="prev-desc-label">My Commits</div>
        <input type="number" value={editProjectCommits} onChange={e => setEditProjectCommits(Number(e.target.value))}/>
        <div className="prev-desc-label">Team Size</div>
        <input type="number" value={editProjectTeamSize} onChange={e => setEditProjectTeamSize(Number(e.target.value))}/>
        <div className="remove-project-button" onClick={() => setShowRemoveConfirmModal(true)}>Remove Project</div>
        <div className="prev-submit-container">
          <div className="prev-submit-edits" onClick={handleSubmitEdits}>Submit</div>
        </div>
        <ion-icon 
          name="close-outline"
          style={{
            color: 'lightgrey', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            position: 'absolute',
            top: 5,
            left: 5,
          }}
          onClick={() => setShowEditPageModal(false)}
        />
      </MyModal>
      <MyModal 
        modalStyle={{width: "20%", padding: "20px", overflow: "scroll", top: 20}}
        show={showRemoveConfirmModal} 
        setShow={setShowRemoveConfirmModal}
      >
        <div className="remove-confirm-title">Are you sure you want to remove the project "{editProjectProject}"?</div>
        <div className="remove-buttons-container">
          <div className="cancel-button" onClick={() => setShowRemoveConfirmModal(false)}>Cancel</div>
          <div className="remove-project-button" onClick={handleRemoveProject}>Remove Project</div>
        </div>
      </MyModal>
      <MyModal 
        modalStyle={{padding: "100px", overflow: "scroll"}}
        show={showLoadingModal} 
      >
        <div className="preview-modal-loading-container">
          <ClimbingBoxLoader color="#0099FF" size={20}/>
          <div className="preview-modal-loading-title">Removing project "{editProjectProject}"...</div>
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
          Object
          .keys(projects).sort(function(a, b){
              return projects[a].idx - projects[b].idx;
          }).map((project, idx) => (
            <SwiperSlide className="preview-slide">
              <div className="prev-hor-container">
                <img
                  // src={projects[project].image ?? "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                  src={projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                  alt="project preview"
                  className="slide-image"
                />
                <div className="preview-text-container">
                  <div className="prev-title">{projects[project].title}</div>
                  <img
                    src={projects[project].image?.includes("https://") ? projects[project].image : "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}
                    // src={projects[project].image ?? "https://preview.redd.it/vxb5lk0zxra71.png?auto=webp&s=bbf8e7d6a39fe7b0e29345e5e4cd56492794f09c"}              
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
              <div className="prev-wave" style={{display: wavesEnabled ? 'unset': 'none'}}>
                {prevWaves[idx % 4]}
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}
