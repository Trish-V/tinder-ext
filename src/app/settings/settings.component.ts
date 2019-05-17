import { Component, OnInit, Input } from '@angular/core'
import { coerceNumberProperty } from '@angular/cdk/coercion'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {



  expType = '1'

  bdyType = '1'

  pets = '1'

  smokers = '1'

  drinkers = '1'

  orientation = '1'

  mutual = '1'

  profession: any
  professionValue = ''

  religion = '1'

  childrenPreference = '1'

  ethnicity = {
    asian: true,
    black: false,
    indian: false,
    hispanic: false,
    arabic: false,
    white: false
  }





  panelOpenState = false



  autoTicks = false
  disabled = false
  invert = false
  max = 9
  min = 3
  showTicks = false
  step = 1
  thumbLabel = true

  value = 5
  vertical = false

  userPreferences = {
    expType: this.expType,
    bdyType: this.bdyType,
    pets: this.pets,
    smokers: this.smokers,
    drinkers: this.drinkers,
    orientation: this.orientation,
    mutual: this.mutual,
    profession: this.professionValue,
    religion: this.religion,
    childrenPreference: this.childrenPreference,
    ethnicity: this.ethnicity



  }

  constructor() { }

  ngOnInit() {
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value)
  }
  private _tickInterval = 1
  formatLabel(value: number | null) {
    if (!value) {
      return 0
    }

    if (value >= 3) {
      return value + 'ft'
    }

    return value
  }


  onFormChange() {
    // alert(JSON.stringify(this.proffesion))  
    this.professionValue = this.profession.toString()
    this.userPreferences = {
      expType: this.expType,
      bdyType: this.bdyType,
      pets: this.pets,
      smokers: this.smokers,
      drinkers: this.drinkers,
      orientation: this.orientation,
      mutual: this.mutual,
      profession: this.professionValue,
      religion: this.religion,
      childrenPreference: this.childrenPreference,
      ethnicity: this.ethnicity
    }



    alert(JSON.stringify(this.userPreferences, null, 2))


    
  }

  goToHomePage() {

  }




}
