/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext, useRef, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {useString} from '../utils/useString';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import TertiaryButton from '../atoms/TertiaryButton';
import Spacer from '../atoms/Spacer';
import RemoteMutePopup from '../subComponents/RemoteMutePopup';
import {calculatePosition} from '../utils/common';
import TextInput from '../atoms/TextInput';
import {PollContext} from './PollContext';
import {
  I18nMuteType,
  peoplePanelMuteAllMicBtnText,
  peoplePanelTurnoffAllCameraBtnText,
} from '../language/default-labels/videoCallScreenLabels';
import PrimaryButton from '../atoms/PrimaryButton';

export interface MuteAllAudioButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

export const MuteAllAudioButton = (props: MuteAllAudioButtonProps) => {
  const [showAudioMuteModal, setShowAudioMuteModal] = useState(false);
  const audioBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteAudio = useRemoteMute();
  const muteAllAudioButton = useString(peoplePanelMuteAllMicBtnText)();
  const onPressAction = () => muteRemoteAudio(MUTE_REMOTE_TYPE.audio);
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const showAudioModal = () => {
    audioBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: localWidth / 2,
            right: -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowAudioMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showAudioModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.audio}
        actionMenuVisible={showAudioMuteModal}
        setActionMenuVisible={setShowAudioMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowAudioMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (audioBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllAudioButton}
      />
    </>
  );
};

export interface MuteAllVideoButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}
export const MuteAllVideoButton = (props: MuteAllVideoButtonProps) => {
  const [showVideoMuteModal, setShowVideoMuteModal] = useState(false);
  const videoBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteVideo = useRemoteMute();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const muteAllVideoButton = useString(peoplePanelTurnoffAllCameraBtnText)();
  const onPressAction = () => muteRemoteVideo(MUTE_REMOTE_TYPE.video);
  const showVideoModal = () => {
    videoBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: globalWidth < 720 ? 0 : localWidth / 2,
            right: globalHeight < 720 ? 0 : -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowVideoMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showVideoModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.video}
        actionMenuVisible={showVideoMuteModal}
        setActionMenuVisible={setShowVideoMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowVideoMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (videoBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllVideoButton}
      />
    </>
  );
};

const HostControlView = () => {
  const { question, setQuestion, answers, setAnswers, setIsModalOpen } =
    useContext(PollContext);
  return (
    <View style={style.container}>
      <View style={{ marginTop: 20 }}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Poll Question"
          style={style.textInput}
        />
        {answers.map((answer, i) => (
          <View key={i} style={{ marginTop: 10 }}>
            <TextInput
              value={answer.option}
              onChangeText={(value) =>
                setAnswers([
                  ...answers.slice(0, i),
                  { option: value, votes: 0 },
                  ...answers.slice(i + 1),
                ])
              }
              placeholder={`Poll Answer ${i + 1}`}
              style={style.textInput}
            />
          </View>
        ))}
      </View>
      <View style={style.buttonsContainer}>
        <PrimaryButton
          onPress={() => {
            setIsModalOpen(true);
          }}
          text="Start Poll"
        />
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Add padding to the sides for better layout
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20, // Add padding to the sides for better layout
  },
  textInput: {
    width: '100%', // Take up full width
    height: 40, // Adjust height as needed
    backgroundColor: 'transparent', // Make text input background transparent
    borderWidth: 1, // Add border for visibility
    borderColor: 'white', // Border color white
    borderRadius: 5, // Add some border radius for styling
    paddingHorizontal: 10, // Add padding horizontally
    color: 'white', // Text color white
  },
});

export default HostControlView;
