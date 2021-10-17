import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Title} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';

export default function HomeScreen({navigation}) {
    const {user, logout} = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('THREADS')
            .onSnapshot((querySnapshot) => {
                const threads = querySnapshot.docs.map((documentSnapshot) => {
                    return {
                        _id: documentSnapshot.id,
                        // give defaults
                        name: '',
                        ...documentSnapshot.data(),
                    };
                });

                setThreads(threads);

                if (loading) {
                    setLoading(false);
                }
            });
        //unsubscribe listener
        return () => unsubscribe();
    }, []);
    if (loading) {
        return <Loading/>;
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
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Room', { thread: item })}
                        >
                            <List.Item
                                title={item.name}
                                description='Item description'
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
});