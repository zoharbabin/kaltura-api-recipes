require "net/http"

class MainController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'kaltura'
  include Kaltura

  config = KalturaConfiguration.new(102)
  config.service_url = "http://jessex"
  @@client = KalturaClient.new(config);
  @@client.ks = @@client.session_service.start(
      "e472b44321fe63f669d825479b21cdb2",
      "lucybot@example.com",
      KalturaSessionType::USER,
      102)


  def addMetadataProfile
    metadataProfile = KalturaMetadataProfile.new();
    metadataProfile.metadata_object_type = KalturaMetadataObjectType::ENTRY;
    metadataProfile.name = "foo";
    metadataProfile.system_name = "bar";

    xsdData = "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <xsd:element name=\"metadata\">\n    <xsd:complexType>\n      <xsd:sequence>\n        <xsd:element id=\"md_5F84A7E4-5509-993D-CE9C-3B60C0713775\" name=\"Somefield\" minOccurs=\"0\" maxOccurs=\"1\" type=\"textType\">\n          <xsd:annotation>\n            <xsd:documentation></xsd:documentation>\n            <xsd:appinfo>\n              <label>somefield</label>\n              <key>somefield</key>\n              <searchable>true</searchable>\n              <timeControl>false</timeControl>\n              <description></description>\n            </xsd:appinfo>\n          </xsd:annotation>\n        </xsd:element>\n      </xsd:sequence>\n    </xsd:complexType>\n  </xsd:element>\n  <xsd:complexType name=\"textType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"dateType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:long\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"objectType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:simpleType name=\"listType\">\n    <xsd:restriction base=\"xsd:string\"/>\n  </xsd:simpleType>\n</xsd:schema>";
    viewsData = nil;

    results = @@client.metadata_profile_service.add(
        metadataProfile,
        xsdData,
        viewsData)
    render :template => "main/_metadata_profile_show", :locals => {:result => results}
  end
end
