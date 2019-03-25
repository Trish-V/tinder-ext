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
  
  proffesion = ''
  
  religion = '1'
  
  childrenPrefference = '1'
  
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
      return 0;
    }

    if (value >= 3) {
      return value + 'ft';
    }

    return value;
  }
}
