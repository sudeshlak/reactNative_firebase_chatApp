import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Title} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatsBar from '../utils/useStatusBar';
import {Modal, Text, Pressable} from "react-native";
import FormInput from "../components/FormInput";

export default function HomeScreen({navigation}) {
    useStatsBar('light-content');
    const {user, logout} = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [newName,setNewName] = useState('');


    useEffect(() => {
        const unsubscribe = firestore()
            .collection('THREADS')
            // add this
            .orderBy('latestMessage.createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const threads = querySnapshot.docs.map(documentSnapshot => {
                    return {
                        _id: documentSnapshot.id,
                        name: '',
                        // add this
                        latestMessage: {
                            text: ''
                        },
                        // ---
                        ...documentSnapshot.data()
                    };
                });

                setThreads(threads);

                if (loading) {
                    setLoading(false);
                }
            });

        return () => unsubscribe();
    }, []);
    if (loading) {
        return <Loading/>;
    }

    const handleLogPress = (item) => {
        setModalVisible(true);
        setRoomToDelete(item);
    }
    const deleteRoom = async (item) => {
        await firestore()
            .collection('THREADS')
            .doc(item._id).delete();
        setModalVisible(false);
        setRoomToDelete(null);
    }
    const updateRoom = async (item) => {
        if(!newName){
            return;
        }
        await firestore()
            .collection('THREADS')
            .doc(item._id).update({name:newName})
        setModalVisible(false);
        setRoomToDelete(null);
    }

    return (
        <View style={styles.container}>
            {/*<Title>Home Screen</Title>*/}
            {/*<Title>All chat rooms will be listed here</Title>*/}
            {/*<Title>{user.uid}</Title>*/}
            <FlatList
                data={threads}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <Divider/>}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Room', {thread: item})}
                                      onLongPress={() => handleLogPress(item)}>
                        <List.Item
                            title={item.name}
                            description={item.latestMessage.text}
                            titleNumberOfLines={1}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            descriptionNumberOfLines={1}
                        />
                    </TouchableOpacity>
                )}
            />
            <FormButton
                modeValue="contained"
                title="Logout"
                onPress={() => logout()}
            />
            {modalVisible &&
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Update room Name : {roomToDelete && roomToDelete.name}</Text>
                        <FormInput
                            labelName="New Name"
                            value={newName}
                            onChangeText={newName => setNewName(newName)}
                        />
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonOpen2]}
                                onPress={() => updateRoom(roomToDelete)}
                            >
                                <Text style={styles.textStyle}>Update</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.modalText2}>Delete room : {roomToDelete && roomToDelete.name}</Text>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => deleteRoom(roomToDelete)}
                            >
                                <Text style={styles.textStyle}>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>No</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>


            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    listTitle: {
        fontSize: 22,
    },
    listDescription: {
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 5,
        width: '40%',
        alignContent: 'flex-start'
    },
    buttonOpen: {
        backgroundColor: "#78f58d",
        marginLeft: 40
    },
    buttonOpen2: {
        backgroundColor: "#78f58d",
        marginLeft: 150
    },
    buttonClose: {
        backgroundColor: "#fa0505",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 5,
        textAlign: "center"
    },
    modalText2: {
        marginBottom: 5,
        marginTop: 30,
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: 'row'
    }
});