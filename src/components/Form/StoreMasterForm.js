import React from "react";
import PropTypes from "prop-types";
import GourmetSiteStoreMaterForm from "components/GourmetSiteStoreMaterForm";
import StoreInformation from "components/StoreInformation";
import SalesInformation from "components/SalesInformation";
import RemindMessageSettings from "components/RemindMessageSettings";
import NetReservationPageSettings from "components/NetReservationPageSettings";
function StoreMasterForm({
  control,
  handlePostalCodeSelection,
  fetchPostalCodeSuggestions,
  postalCodeSuggestions,
  watch,
  isEdit,
  onCopyText,
  onChangeHolidays,
  checkedHolidays,
}) {
  return (
    <div className="form-wrapper">
      <StoreInformation
        control={control}
        handlePostalCodeSelection={handlePostalCodeSelection}
        fetchPostalCodeSuggestions={fetchPostalCodeSuggestions}
        postalCodeSuggestions={postalCodeSuggestions}
      />
      <SalesInformation
        control={control}
        onChangeHolidays={onChangeHolidays}
        checkedHolidays={checkedHolidays}
      />
      <RemindMessageSettings control={control} />
      <NetReservationPageSettings
        control={control}
        watch={watch}
        onCopyText={onCopyText}
        isEdit={isEdit}
      />
      <GourmetSiteStoreMaterForm control={control} />
    </div>
  );
}

StoreMasterForm.propTypes = {
  control: PropTypes.any,
  handlePostalCodeSelection: PropTypes.func,
  fetchPostalCodeSuggestions: PropTypes.func,
  postalCodeSuggestions: PropTypes.array,
  watch: PropTypes.any,
  isEdit: PropTypes.bool,
  onCopyText: PropTypes.func,
  onChangeHolidays: PropTypes.func,
  checkedHolidays: PropTypes.array,
};

export default StoreMasterForm;
