import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Share,
  Button,
} from 'react-native';
// import Video from 'react-native-video';
import Modal from 'react-native-modal';
import {
  FileSystem,
  MediaLibrary,
  Permissions,
  Video
} from 'expo';
import {
  MaterialIcons,
  Foundation
} from '@expo/vector-icons';
import Photo from '../components/Camera/Photo';
import { centerScreen } from '../src/css/style';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class GalleryScreen extends React.Component {
  state = {
    faces: {},
    images: {},
    photos: [],
    selected: [],
    isShowPreviewVideoModal: false,
    videoName: null,
  };

  componentDidMount = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    console.log('GalleryScreen componentDidMount: ', photos);
    this.setState({ photos });
  };

  toggleSelection = (uri, isSelected) => {
    let selected = this.state.selected;
    if (isSelected) {
      selected.push(uri);
    } else {
      selected = selected.filter(item => item !== uri);
    }
    this.setState({ selected });
  };

  saveToGallery = async () => {
    const photos = this.state.selected;

    if (photos.length > 0) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        throw new Error('Denied CAMERA_ROLL permissions!');
      }

      const promises = photos.map(photoUri => {
        return MediaLibrary.createAssetAsync(photoUri);
      });

      await Promise.all(promises);
      alert('Successfully saved photos to your gallery!');
    } else {
      alert('No photos to save!');
    }
  };

  _sharePictures = async () => {
    const photos = this.state.selected;
    console.log('_sharePictures photo data: ', photos);
    try {
      const result = await Share.share(
        {
          message:
            'React Native | A framework for building native apps using React',
          url: photos[0],
        },
        {
          // Android
          dialogTitle: "Share Test",
          // iOS
          excludedActivityTypes: [
            // 'com.apple.UIKit.activity.PostToWeibo',
            // 'com.apple.UIKit.activity.Print',
            // 'com.apple.UIKit.activity.CopyToPasteboard',
            // 'com.apple.UIKit.activity.AssignToContact',
            // 'com.apple.UIKit.activity.SaveToCameraRoll',
            // 'com.apple.UIKit.activity.AddToReadingList',
            // 'com.apple.UIKit.activity.PostToFlickr',
            // 'com.apple.UIKit.activity.PostToVimeo',
            // 'com.apple.UIKit.activity.PostToTencentWeibo',
            // 'com.apple.UIKit.activity.AirDrop',
            // 'com.apple.UIKit.activity.OpenInIBooks',
            // 'com.apple.UIKit.activity.MarkupAsPDF',
            // 'com.apple.reminders.RemindersEditorExtension',
            // 'com.apple.mobilenotes.SharingExtension',
            // 'com.apple.mobileslideshow.StreamShareService',
            // 'com.linkedin.LinkedIn.ShareExtension',
            // 'pinterest.ShareExtension',
            // 'com.google.GooglePlus.ShareExtension',
            // 'com.tumblr.tumblr.Share-With-Tumblr',
            // 'net.whatsapp.WhatsApp.ShareExtension', //WhatsApp
          ],
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  _openPreviewVideoModal = (renderingVideoName) => {
    this.setState({
      isShowPreviewVideoModal: true,
      videoName: renderingVideoName
    });
  }

  _renderVideoPreview = () => {
    const { videoName } = this.state;
    console.log('_renderVideoPreview: ', videoName);
    if (videoName) {
      return (
        <View>
          <Text style={{color: '#fff'}}>{`${PHOTOS_DIR}/${videoName}`}</Text>
          <Video
            source={{ uri: `${PHOTOS_DIR}/${videoName}` }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{ width: 300, height: 300 }}
          />
        </View>
      );
    }

    return <View />
  }

  renderPhoto = fileName => {
    if (fileName.includes('video')) {
      return (
        <View 
          style={styles.positionRelative}
          key={`_video_${fileName}`}
        >
          <TouchableOpacity
            style={[styles.positionAbsolute, styles.pos]}
            onPress={this._openPreviewVideoModal(fileName)}
          >
            <Foundation name="play-video" size={25} color="white" />
          </TouchableOpacity>

          <Photo
            key={`${fileName}_video`}
            uri={`${PHOTOS_DIR}/${fileName}`}
            onSelectionToggle={this.toggleSelection}
          />
        </View>        
      );
    }

    return (
      <Photo
        key={fileName}
        uri={`${PHOTOS_DIR}/${fileName}`}
        onSelectionToggle={this.toggleSelection}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
            <MaterialIcons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <View
            style={styles.row}
          >
            <TouchableOpacity style={styles.button} onPress={this.saveToGallery}>
              <MaterialIcons name="save" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this._sharePictures}>
              <MaterialIcons name="share" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(this.renderPhoto)}
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.isShowPreviewVideoModal}
        >
          {this._renderVideoPreview()}
          <Button
            title="Close"
            onPress={() => this.setState({ 
              isShowPreviewVideoModal: false,
              videoName: null
             })}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row'
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4630EB',
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  button: {
    padding: 20,
  },
  whiteText: {
    color: 'white',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionRelative: {
    position: 'relative'
  },
  positionAbsolute: {
    position: 'absolute'
  },
  pos: {
    zIndex: 9,
    top: 5,
    right: 45,
  },
  centerScreen,
});
