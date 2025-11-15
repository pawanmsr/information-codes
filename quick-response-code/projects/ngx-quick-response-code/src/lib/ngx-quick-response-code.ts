import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Markers } from './utils/markers';
import { Analyzer } from './utils/analyzer';
import { ErrorCorrection } from './utils/error';
import { hexToColor, Matrix } from './utils/matrix';
import { BITS_IN_BYTE, ERROR_CORRECTION_LEVEL, FORMAT_ERROR_LENGTH, FORMAT_GOLAY } from './utils/constants';
import { TESTS, QUIET_ZONE_SIZE, VERSION, VERSION_ERROR_LENGTH, VERSION_GOLAY } from './utils/constants';
import { identifierLevel } from './utils/tables';

@Component({
  selector: 'ngx-quick-response-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #code></canvas>`,
  styles: ``,
})
export class QuickResponseCode implements AfterViewInit, OnChanges {
  @Input() text: string = TESTS[0];
  @Input() quietZoneSize: number = QUIET_ZONE_SIZE;
  @Input() minimumVersion: number = VERSION.MIN;
  @Input() minimumErrorLevel: string = ERROR_CORRECTION_LEVEL.L;
  @Input() maximumSize: number = 1 << BITS_IN_BYTE;
  @Input() lightColor: string = "#FFFFFFFF";
  @Input() darkColor: string = "#000000FF";

  @ViewChild('code', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  private draw(context: CanvasRenderingContext2D): void {
    // Readability over optimization.
    // TODO: optimize while maintaining readability.
    let analyzer: Analyzer = new Analyzer(this.text);
    analyzer.setMinimumVersionAndLevel(this.minimumVersion,
      identifierLevel(this.minimumErrorLevel));

    let markers: Markers = new Markers(analyzer.getVersion());

    let correction: ErrorCorrection = new ErrorCorrection(
      analyzer.getVersion(), analyzer.getLevel(), analyzer.getBlocks());
    
    // Matrix methods must be applied in order.
    let matrix: Matrix = new Matrix(markers.size(),
      this.quietZoneSize, markers.scale(this.maximumSize));

    markers.finderPatterns().forEach(center => {
      matrix.placeFinderPattern(center)
    });

    markers.alignmentPatterns().forEach(center => {
      matrix.placeAlignmentPattern(center);
    });

    matrix.addTimingPattern();

    matrix.addFormatInformation(matrix.merge([analyzer.getFormatData(),
      correction.getBinaryError(analyzer.getFormatData(),
        FORMAT_ERROR_LENGTH, FORMAT_GOLAY)]));
    
    matrix.addVersionInformation(analyzer.getVersion(),
      matrix.merge([analyzer.getVersionData(),
        correction.getBinaryError(analyzer.getVersionData(),
          VERSION_ERROR_LENGTH, VERSION_GOLAY)]));
    
    matrix.addData(matrix.merge([matrix.interleave(analyzer.getBlocks()),
      matrix.interleave(correction.getErrorBlocks())]));
    
    analyzer.setMaskPattern(matrix.applyOptimalMask(analyzer.getFormatDataForMaskPatterns(),
      correction.getFormatErrorsForMaskPatterns(analyzer.getFormatDataForMaskPatterns())));

    // Draw image
    context.clearRect(0, 0, this.canvas.nativeElement.width,
      this.canvas.nativeElement.height);
    this.canvas.nativeElement.height = matrix.imageSize();
    this.canvas.nativeElement.width = matrix.imageSize();

    let data = context.createImageData(matrix.imageSize(), matrix.imageSize()).data;
    data.set(matrix.getScaledRGBAMap(hexToColor(this.lightColor),
      hexToColor(this.darkColor)), 0);

    let newImage = new ImageData(data,
      matrix.imageSize(), matrix.imageSize());
    context.putImageData(newImage, 0, 0);
  }

  ngAfterViewInit(): void {
    let context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      this.draw(context);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      // TODO: loading.
      this.draw(context);
    }
  }
}
