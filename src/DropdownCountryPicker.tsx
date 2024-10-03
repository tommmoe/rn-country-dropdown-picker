import React, { useEffect, useRef, useState } from "react";
import Flag from "react-native-country-flag";
import {
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Text from "../../../src/components/Text";
import TextInput from "../../../src/components/TextInput";
import { CountryCodes, CountryNames } from "./data";
import * as AllFunctions from "./functions";
import { RenderComProp, RProps } from "rn-country-dropdown-picker";

export default function DropdownCountyPicker({
  ContainerStyle,
  InputFieldStyle,
  DropdownCountryTextStyle,
  DropdownContainerStyle,
  DropdownRowStyle,
  countryNameStyle,
  flagSize,
  Placeholder,
  selectedItem,
  initialValue,
  resetKey,
}: RProps & { resetKey: string }) {
  const [term, setTerm] = useState<string>("");
  const [iso, setISO] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const filteredCodes = useRef<string[]>(CountryCodes);

  useEffect(() => {
    if (initialValue) {
      updateCountrySelection(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    resetSelection();
  }, [resetKey]);

  const updateCountrySelection = (code: string) => {
    const name = AllFunctions.getName(code);
    setISO(code);
    setTerm(name);
    selectedItem({ country: name, code: code });
    setIsOpen(false);
  };

  const resetSelection = () => {
    setTerm("");
    setISO("");
    setIsOpen(false);
    filteredCodes.current = CountryCodes;
    setRefresh(prev => !prev);
    selectedItem({ country: "", code: "" });
  };

  const renderItem: React.FC<RenderComProp> = ({ item }) => {
    const name = AllFunctions.getName(item);

    return (
      <TouchableOpacity
        style={[
          styles.rowTouchable,
          DropdownRowStyle,
        ]}
        activeOpacity={0.7}
        onPress={() => updateCountrySelection(item)}
      >
        <View style={styles.rowContent}>
          <Flag isoCode={item} size={flagSize || 24} />
          <Text
            style={[
              styles.DropdownCountryTextStyle,
              DropdownCountryTextStyle,
            ]}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const searchFilter = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const input = e.nativeEvent.text;
    setTerm(input);
    setISO("");
    setIsOpen(input.length > 0);

    const convertedCodes = CountryNames
      .filter(item => item.toLowerCase().includes(input.toLowerCase()))
      .map(e => AllFunctions.getCode(e)!)
      .filter(Boolean);

    filteredCodes.current = convertedCodes;
    setRefresh(prev => !prev);
  };

  return (
    <View style={ContainerStyle ? ContainerStyle : styles.viewStyle}>
      <TouchableOpacity
        style={
          InputFieldStyle
            ? [InputFieldStyle, styles.InputFieldDefault]
            : styles.InputField
        }
        onPress={() => setIsOpen(!isOpen)}
      >
        {iso ? (
          <Flag isoCode={iso} size={24} />
        ) : null}
        <TextInput
          style={
            countryNameStyle
              ? countryNameStyle
              : [
                  styles.countryNameStyle,
                  {
                    paddingStart: iso ? 20 : 0,
                  },
                ]
          }
          placeholder={Placeholder || "Select Country..."}
          placeholderTextColor="black"
          value={term}
          onChange={searchFilter}
          onFocus={() => setIsOpen(true)}
        />
      </TouchableOpacity>
      {isOpen && (
      <FlatList
        style={[
          styles.dropdownContainer,
          DropdownContainerStyle,
          {
            maxHeight: isOpen ? 250 : 0,
            opacity: isOpen ? 1 : 0,
          }
        ]}
        data={filteredCodes.current}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        extraData={refresh}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  InputField: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  InputFieldDefault: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  DropdownCountryTextStyle: {
    fontSize: 20,
    marginVertical: 5,
    paddingStart: 15,
    color: "black",
  },
  countryNameStyle: {
    paddingVertical: 8,
    fontSize: 18,
    paddingStart: 10,
    flex: 1,
    color: "black",
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 0.5,
  },
  rowTouchable: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});