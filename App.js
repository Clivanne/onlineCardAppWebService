import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StatusBar,
    Text,
    TextInput,
    View,
    Image,
    StyleSheet
} from 'react-native';

let originalData = [];

const App = () => {
    const [myData, setMyData] = useState([]);

    const myurl = "https://onlinecardappwebservice-rzei.onrender.com/allkpop";

    useEffect(() => {
        fetch(myurl)
            .then((response) => response.json())
            .then((myJson) => {
                if (originalData.length < 1) {
                    setMyData(myJson);
                    originalData = myJson;
                }
            });
    }, []);

    const FilterData = (text) => {
        if (text != '') {
            let myFilteredData = originalData.filter((item) =>
                item.group_name.includes(text)
            );
            setMyData(myFilteredData);
        } else {
            setMyData(originalData);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.name}>{item.group_name}</Text>
                <Image
                    source={{ uri: item.group_pic }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        );
    };

    return (
        <View>
            <StatusBar />
            <Text>Search KPOP Group:</Text>
            <TextInput
                style={{ borderWidth: 1 }}
                onChangeText={(text) => FilterData(text)}
            />
            <FlatList
                data={myData}
                renderItem={renderItem}
            />
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        marginVertical: 6,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
        marginRight: 10,
    },
    image: {
        width: 120,
        height: 160,
    },
});
