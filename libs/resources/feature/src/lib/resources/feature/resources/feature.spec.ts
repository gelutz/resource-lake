import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourcesFeature } from './feature';

describe('ResourcesFeature', () => {
  let component: ResourcesFeature;
  let fixture: ComponentFixture<ResourcesFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
