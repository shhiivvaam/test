import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { User } from "firebase/auth";

import { getInvitationMemberListSelector } from "../../redux/workspace/workspace.selector";
import { getInvitationUserList } from "../../redux/workspace/workspace.api";

export interface InvitationUser {
  uid: string;
  email: string;
  displayName: string;
}

type InvitationInputProps = {
  onItemSelected: (invitedUsers: InvitationUser[]) => void;
  user: User | undefined;
};

const InvitationInput: React.FC<InvitationInputProps> = ({
  onItemSelected,
  user
}) => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<InvitationUser[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const invitationMembersList = useSelector(
    getInvitationMemberListSelector,
    shallowEqual
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (selectedItems.length < 3) {
      setInputValue(e.target.value);
      setShowDropdown(true);
    }
  };

  const handleItemSelect = (item: InvitationUser): void => {
    if (
      selectedItems.length < 3 &&
      !selectedItems.some((selected) => selected.uid === item.uid)
    ) {
      setSelectedItems([...selectedItems, item]);
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const handleRemoveItem = (uid: string): void => {
    setSelectedItems(selectedItems?.filter((selected) => selected.uid !== uid));
  };

  useEffect(() => {
    if (user) {
      dispatch(getInvitationUserList(user));
    }
  }, [dispatch, user]);

  useEffect(() => {
    onItemSelected(selectedItems);
  }, [selectedItems, onItemSelected]);



  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <span
            key={item.uid}
            className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
            onClick={() => handleRemoveItem(item.uid)}
          >
            {item.displayName} &times;
          </span>
        ))}
      </div>
      <input
        className="pl-2 outline-none border-none w-full font-poppins-regular"
        type="text"
        placeholder="Invite members"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => selectedItems.length < 3 && setShowDropdown(true)}
        disabled={selectedItems.length >= 3}
      />
      {showDropdown && inputValue && selectedItems.length < 3 && (
        <div className="absolute bg-white border rounded-md w-full shadow-lg z-10">
          {invitationMembersList
            .filter(
              (item) =>
                item.displayName
                  ?.toLowerCase()
                  .includes(inputValue?.toLowerCase()) &&
                !selectedItems.some((selected) => selected.uid === item.uid)
            )
            .map((item) => (
              <div
                key={item.uid}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                {item.displayName}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default InvitationInput;
