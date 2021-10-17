import React, {useState} from 'react';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import { ActivityIndicator} from 'react-native';
const styles = StyleSheet.create({
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default function RoomScreen() {

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }

    const [messages, setMessages] = useState([
        {
            _id: 0,
            text: 'New room created.',
            createdAt: new Date().getTime(),
            system: true
        },
        // example of chat message
        {
            _id: 1,
            text: 'Henlo!',
            createdAt: new Date().getTime(),
            user: {
                _id: 2,
                name: 'Test User'
            }
        }
    ]);

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon='send-circle' size={32} color='#6646ee'/>
                </View>
            </Send>
        );
    }

    function renderBubble(props) {
        return (
            // Step 3: return the component
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Here is the color change
                        backgroundColor: '#6646ee'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

    function handleSend(newMessage = []) {
        setMessages(GiftedChat.append(messages, newMessage));
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={newMessage => handleSend(newMessage)}
            user={{ _id: 1, name: 'User Test' }}
            renderBubble={renderBubble}
            placeholder='Type your message here...'
            showUserAvatar
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
        />
    );
}