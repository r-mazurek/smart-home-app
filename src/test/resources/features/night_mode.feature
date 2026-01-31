Feature: Night Mode Automation
  As a user
  I want the house to automatically dim lights at night
  So that I can save energy and sleep better

  Scenario: Lights should dim automatically after 22:00
    Given a room named "Bedroom" exists
    And the room has a device named "BedLamp" which is a LightBulb
    And the "BedLamp" is turned ON at 100% brightness
    When the clock strikes 23:00
    Then the "BedLamp" brightness should be reduced by 25%