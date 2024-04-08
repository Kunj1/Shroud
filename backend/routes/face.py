from deepface import DeepFace

def verify(img1,img2):
    result=DeepFace.verify(img1_path=img1,img2_path=img2,model_name='Facenet', detector_backend='mtcnn', enforce_detection=False)
    if (result['distance']<0.15):
        return True
    else:
        return False